# Senior Backend Interview Preparation: URL Shortener Project

This document contains a curated list of 35 high-quality interview questions and answers based on the **LinkMagic URL Shortener** project. These questions focus on system design, database optimization, caching, security, and scalability from a Senior Backend Engineer's perspective (2+ years experience).

---

### **Phase 1: Core Logic & URL Shortening**

**Q1. Why did you choose Base62 encoding for short codes instead of Base32 or Base64?**  
**Answer:** Base62 (`a-z, A-Z, 0-9`) is the industry standard for URL shorteners because it uses only alphanumeric characters, making it "URL-safe" without needing special characters like `+` or `/` (found in Base64) which require URL encoding. It provides a large enough namespace ($62^6 \approx 56.8$ billion combinations) for a 6-character string while remaining human-readable and easy to copy-paste.

**Q2. In your `UrlService`, you use a random 6-character generator with a retry mechanism (up to 10 retries). What are the trade-offs of this approach versus a counter-based (sequential) approach?**  
**Answer:** The **random approach** prevents "ID guessing" or "scrapping," which is a security benefit (users can't guess `link.com/aaaaa1` from `link.com/aaaaa0`). However, as the database grows, the collision probability increases, leading to more retries and higher latency. A **sequential approach** using a global counter/Zookeeper is more efficient (zero collisions) but requires careful management to prevent predictable URLs and usually needs a "shuffling" or "hashing" layer (like Hashids) to mask the sequence.

**Q3. How do you handle the "Custom Slug" feature? What happens if two users request the same slug simultaneously?**  
**Answer:** I implement custom slugs by checking both the `short_code` and `custom_slug` columns in the `url` table. To handle concurrency, I rely on a **unique constraint** at the database level on these columns. Even if two threads pass the application-level "exists" check, the database will throw a `DataIntegrityViolationException` for the second one, which we catch and map to a 409 Conflict error.

**Q4. Your `ShortCodeGenerator` uses `SecureRandom`. Why not just `java.util.Random`?**  
**Answer:** `java.util.Random` uses a LCG (Linear Congruential Generator) which is predictable if you know a few previous outputs. For a public-facing URL shortener, predictability allows attackers to pre-calculate and "squat" on future short codes. `SecureRandom` is cryptographically strong and much harder to predict, making our short-link generation more secure against systematic link-enumeration attacks.

---

### **Phase 2: Database Design & Optimization**

**Q5. Tell me about your database schema. Why MySQL for this project instead of a NoSQL DB like MongoDB?**  
**Answer:** URL shorteners are read-heavy but require strong consistency for link creation (uniqueness). MySQL with InnoDB provides **ACID compliance**, which is critical for ensuring no two users get the same short code. While NoSQL scales horizontally better, a URL shortener's core data model is highly relational (User -> URLs -> Analytics). MySQL's B+ Tree indexing is extremely efficient for the primary lookup: `SELECT original_url FROM urls WHERE short_code = ?`.

**Q6. What indexes have you created on the `urls` table? Explain the reasoning.**  
**Answer:** 
1. `short_code` (Unique Index): This is the most frequent lookup point for redirection.
2. `custom_slug` (Unique Index): For custom link lookups.
3. `user_id`: To optimize the "My Links" dashboard query.
4. `created_at`: To support sorting and potential cleanup of old links.
I avoided indexing `original_url` because it's a `TEXT/VARCHAR(2048)` field, and indexing such long strings would drastically increase storage and slow down writes without much benefit for our use cases.

**Q7. If the `urls` table grows to 100 million rows, how would you handle the performance degradation?**  
**Answer:** I would implement **Database Sharding**. Since lookups are almost always by `short_code`, I can shard the data based on a hash of the short code. This distributes the load across multiple physical databases. Additionally, I would implement an aggressive **TTL-based cleanup** for expired links (which my current service already supports) to keep the "hot" data set manageable.

**Q8. You have a `Click` entity for analytics. Writing to the DB on every click will kill performance. How would you optimize this?**  
**Answer:** Currently, it's a direct write. In a high-traffic scenario, I would move to **Buffered Writes** or an **Async Messaging Queue (Kafka)**. Instead of hitting the DB on every redirect, I'd push the click event to Kafka. A consumer would then batch-process these events (e.g., every 5 seconds or 1000 messages) to update the `click_count` and insert `Click` records in bulk, significantly reducing IOPS on the database.

---

### **Phase 3: Caching with Redis**

**Q9. How does your caching strategy work? Is it Read-through or Cache-aside?**  
**Answer:** It follows the **Cache-aside (Lazy Loading)** pattern. When a request comes in, we check Redis first. If it's a "miss," we query MySQL, then write the result back to Redis with a TTL. This ensures that popular (viral) links are served entirely from memory, protecting our database from spikes.

**Q10. How do you handle "Cache Invalidation"?**  
**Answer:** Invalidation happens in two scenarios:
1. **Updates/Deactivation:** If a link is deleted or expires, we explicitly call `redisTemplate.delete(shortCode)`.
2. **TTL (Time To Live):** Every cache entry has an expiry (e.g., 24 hours). This ensures that even if we miss an explicit invalidation, the stale data won't persist forever.

**Q11. What happens if Redis goes down? (Cache Penetration / Thundering Herd)**  
**Answer:** The application would fall back to the database. To prevent a "Thundering Herd" where thousands of concurrent requests for a viral link hit the DB at once when the cache expires/fails, I would use **Synchronized Cache Loading**. Only one thread is allowed to query the DB for a specific key and populate the cache, while others wait for the cache to become available.

**Q12. You are caching `short_code -> original_url`. What about the "Click Count"? Do you cache that too?**  
**Answer:** Caching click counts is tricky because they change frequently. I use Redis as a **Write-through cache** for counters. I increment the count in Redis using `INCR` (atomic operation) and periodically sync it to the DB. This gives users real-time feedback on their dashboard without hammering the DB for every single click update.

---

### **Phase 4: API Design & Performance**

**Q13. How do you handle "Bulk Shortening" of URLs? I see `CompletableFuture` in your code.**  
**Answer:** For bulk requests, processing sequentially would lead to high response times (Total Time = N * Latency). I use `CompletableFuture.supplyAsync` to process each URL shortening task in a separate thread from a `TaskExecutor` pool. This parallelizes the validation and DB insertion, drastically reducing the overall response time for the user.

**Q14. How would you design a "Rate Limiter" for your API?**  
**Answer:** I’d use the **Token Bucket** or **Fixed Window** algorithm implemented via Redis. Since we have users and API Keys, I'd track the request count per `user_id` or `api_key` in Redis with a 1-minute expiration. If the count exceeds the threshold (e.g., 100 req/min), we return a `429 Too Many Requests` status.

**Q15. Why use a `302 Found` (Temporary Redirect) instead of a `301 Moved Permanently`?**  
**Answer:** This is a crucial design choice. `301` is cached by the browser forever. If I use `301`, the browser will never hit my backend again for that link, and I lose all **Analytics** (click tracking). `302` (or `307/308`) ensures the browser always checks with my server first, allowing me to record the click, user-agent, and IP before redirecting.

**Q16. Your project handles User-Agent parsing. Why is this done on the backend?**  
**Answer:** We use the `YAUAA` library to extract the OS, Device Brand, and Browser from the `User-Agent` header. This allows us to provide rich analytics to the user (e.g., "80% of your clicks are from iPhones"). Doing this on the backend ensures we capture data even if the destination site uses its own tracking.

---

### **Phase 5: Security (JWT, OAuth2, API Keys)**

**Q17. How do you secure the `/api/v1/shorten` endpoint?**  
**Answer:** I use a dual-authentication strategy:
1. **JWT (for Web App):** Users logging in via the frontend get a JWT.
2. **API Keys (for Developers):** For programmatic access, users can generate an API Key. I have an `ApiKeyFilter` that checks for an `X-API-KEY` header and validates it against the DB/Cache before allowing the request.

**Q18. How do you prevent "URL Redirection Attacks" (Open Redirects)?**  
**Answer:** Before shortening, I run the URL through a `UrlValidator`. I check against a "Blacklist" of known malicious domains and ensure the protocol is limited to `http` or `https`. This prevents users from using my service to mask phishing links or `javascript:` protocols.

**Q19. How is OAuth2 implemented in your project?**  
**Answer:** I use **Spring Security OAuth2 Client**. When a user clicks "Login with Google," they are redirected to Google. On successful callback, my `OAuth2SuccessHandler` extracts the user's email, creates a record in my `User` table if it doesn't exist, and issues a local JWT to maintain the session.

**Q20. How do you store passwords?**  
**Answer:** I never store plain-text passwords. I use `BCryptPasswordEncoder` with a strength of 10. BCrypt includes a "salt" automatically, which protects against rainbow table attacks.

---

### **Phase 6: Async Processing & Scalability (Extended Concepts)**

**Q21. Your project currently doesn't use Kafka. Where would you introduce it if the traffic grew 100x?**  
**Answer:** I would decouple the **Redirection** logic from the **Analytics** logic. 
- **Current:** Request -> Update DB Count -> Save Click Log -> Redirect. 
- **Scalable:** Request -> Push Click Event to Kafka -> Redirect. 
A separate "Analytics Consumer" would read from Kafka and update the DB in batches. This makes the redirect (the most critical path) extremely fast and independent of DB write latency.

**Q22. How would you handle the "Expiry Cleanup" of millions of links without locking the database?**  
**Answer:** Instead of a simple `DELETE FROM urls WHERE expiry < NOW()`, which locks the table, I would use **Pagination and Throttling**. I’d write a scheduled task that deletes in small chunks (e.g., 1000 rows) with a small sleep interval in between. Or better, use a **TTL index** if we were on NoSQL, or a separate `expired_urls` table to move data out of the main table.

**Q23. If I want to add "AI-powered link categorization" (e.g., flagging adult or spam content), how would you integrate it?**  
**Answer:** I would use an **Async Event-driven approach**. When a URL is shortened, I'd publish an event to a "URL-Created" topic. An AI service (worker) would consume this, call an LLM or a classification API (like OpenAI or AWS Rekognition) to scan the destination content, and update the link's `status` to `FLAGGED` or `SAFE` in the background.

**Q24. How would you handle "Large File" links? For example, if a user shortens a link to a 1GB video.**  
**Answer:** A URL shortener doesn't store the file, only the link. However, if the requirement is to *preview* the file, I would integrate with an S3 bucket. Our backend would generate a **Pre-signed URL** for the large file and then shorten *that* URL. This ensures the heavy lifting of file transfer is handled by S3/Cloudfront, not our application server.

---

### **Phase 7: Resilience & Monitoring**

**Q25. How do you handle "Error Handling" globally in Spring Boot?**  
**Answer:** I use a `@ControllerAdvice` class with `@ExceptionHandler` methods. This ensures that whether it's a `UrlNotFoundException` or a `ValidationException`, the client always receives a consistent JSON structure: `{ "timestamp": ..., "status": 404, "error": "Not Found", "message": "..." }`.

**Q26. What happens if your MySQL database becomes the bottleneck for reads?**  
**Answer:** I would implement **Read Replicas**. I'd have one Master node for writes (`createShortUrl`) and multiple Slave nodes for reads (`getOriginalUrl`). In Spring, I can use a `RoutingDataSource` to route `@Transactional(readOnly = true)` calls to the replicas.

**Q27. How do you monitor the health of your service?**  
**Answer:** I use **Spring Boot Actuator**. It provides endpoints like `/health` and `/metrics`. In a production environment, I'd scrape these metrics using **Prometheus** and visualize them in **Grafana** to track request rates, latency, and 4xx/5xx error percentages.

**Q28. How do you handle "Circuit Breaking" if the Redis cache is slow?**  
**Answer:** I would use **Resilience4j**. If the calls to Redis start timing out or failing beyond a threshold, the circuit breaker "opens," and the application immediately skips the cache and hits the DB (fallback) for a cooling-off period. This prevents the entire application from hanging due to one slow dependency.

---

### **Phase 9: Practical Reasoning & Trade-offs**

**Q29. Why use Flyway for database migrations?**  
**Answer:** It ensures that the database schema is version-controlled alongside the code. When a new developer joins or we deploy to production, Flyway automatically runs the SQL scripts to bring the DB to the latest state. This eliminates the "it works on my machine" schema issues.

**Q30. You used `CompletableFuture.join()` in your bulk shortening. Why is this potentially dangerous?**  
**Answer:** `join()` is a blocking call. If the thread pool is exhausted or the tasks take too long, it can block the main request thread, leading to a bottleneck. A better way would be to return a `202 Accepted` with a `job_id`, process the bulk request in the background, and let the user poll for results.

**Q31. How do you ensure your JWTs are secure?**  
**Answer:** I use a strong secret key (HS512), set a reasonable expiration (e.g., 1 hour), and include only the minimum necessary claims (sub, roles). I also use a `SecurityContext` filter to validate the signature on every request.

**Q32. In `UrlService`, you have a `@Transactional` annotation. Why is it important there?**  
**Answer:** It's vital for atomicity. When we create a URL, we save to the DB AND potentially update user stats. If the user update fails, we want the URL creation to roll back to keep the data consistent.

**Q33. If you had to support "Search" functionality for millions of URLs, would you use SQL `LIKE`?**  
**Answer:** Absolutely not. SQL `LIKE '%query%'` is an $O(N)$ operation that can't use indexes efficiently. I would use an external search engine like **Elasticsearch**. I’d sync my URL data to an ES index, which provides sub-millisecond full-text search capabilities using inverted indexes.

**Q34. How do you handle "Timezones" in your expiry logic?**  
**Answer:** I store all timestamps in **UTC** in the database. This avoids confusion when the server and the users are in different regions. The conversion to local time is handled by the frontend.

**Q35. If you could rewrite one part of this project, what would it be?**  
**Answer:** I would replace the random short-code generation with a **Pre-generated ID Key Provider**. A separate service or background job would pre-generate unique IDs and store them in a "Ready" pool (Redis). This would eliminate the collision-check and retry logic during the user's request, making link creation $O(1)$ and significantly faster.
