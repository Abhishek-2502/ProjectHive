package com.zosh.service;

import com.zosh.domain.PlanType;
import com.zosh.model.Subscription;
import com.zosh.model.User;

public interface SubscriptionService {
    Subscription createSubscription(User user);
    Subscription getUserSubscription(Long userId) throws Exception;
    Subscription upgradeSubscription(Long userId, PlanType planType);

    boolean isValid(Subscription subscription);
}
