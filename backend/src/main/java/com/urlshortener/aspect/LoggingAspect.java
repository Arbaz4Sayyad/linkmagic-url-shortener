package com.urlshortener.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.urlshortener.controller..*(..))")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();
        
        log.info("API Request: {} {} - {}.{}() - Args: {}", 
                request.getMethod(), 
                request.getRequestURI(),
                className, 
                methodName, 
                Arrays.toString(args));
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();
            
            log.info("API Response: {} {} - {}.{}() - Status: SUCCESS - Duration: {}ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    className,
                    methodName,
                    endTime - startTime);
            
            return result;
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            
            log.error("API Error: {} {} - {}.{}() - Status: ERROR - Duration: {}ms - Error: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    className,
                    methodName,
                    endTime - startTime,
                    e.getMessage());
            
            throw e;
        }
    }

    @Around("execution(* com.urlshortener.service..*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        log.debug("Service Method: {}.{}() - Started", className, methodName);
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long endTime = System.currentTimeMillis();
            
            log.debug("Service Method: {}.{}() - Completed in {}ms", className, methodName, endTime - startTime);
            
            return result;
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            
            log.error("Service Method: {}.{}() - Failed after {}ms - Error: {}", 
                    className, methodName, endTime - startTime, e.getMessage(), e);
            
            throw e;
        }
    }
}
