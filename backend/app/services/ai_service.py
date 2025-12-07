"""
AI Classification Service

This service handles automatic classification of models into categories:
- perfectFit: Strong fit, review first
- goodFit: Potential, keep on radar
- lowPotential: Visible, but lower priority

Currently uses mock logic, but structured to easily swap in real AI API calls.
"""

from typing import Dict, List, Optional


def classify_model(model_data: Dict) -> Dict:
    """
    Classify a model based on their data.
    
    Args:
        model_data: Dictionary containing model information:
            - age: int
            - height_cm: int
            - measurements: dict with bust, waist, hips (optional)
            - photos: list of photo URLs (optional)
            - motivation: str (optional)
    
    Returns:
        Dictionary with:
            - score: float (0.0 to 1.0) - internal use only
            - category: str ("perfectFit", "goodFit", "lowPotential")
            - reasons: List[str] - human-readable explanations
    """
    
    age = model_data.get("age", 0)
    height_cm = model_data.get("height_cm", 0)
    measurements = model_data.get("measurements", {})
    photos = model_data.get("photos", [])
    motivation = model_data.get("motivation", "")
    
    score = 0.0
    reasons = []
    
    # Age scoring (prefer 18-25)
    if 18 <= age <= 25:
        score += 0.3
        reasons.append("Optimal age range (18-25)")
    elif 16 <= age <= 27:
        score += 0.2
        reasons.append("Good age range")
    elif age < 16 or age > 30:
        score += 0.05
        reasons.append("Age outside typical range")
    else:
        score += 0.1
        reasons.append("Age within acceptable range")
    
    # Height scoring (prefer 170-180cm for fashion)
    if 170 <= height_cm <= 180:
        score += 0.3
        reasons.append("Ideal height for fashion modeling")
    elif 165 <= height_cm < 170 or 180 < height_cm <= 185:
        score += 0.2
        reasons.append("Good height range")
    elif height_cm >= 160 and height_cm < 190:
        score += 0.1
        reasons.append("Height within acceptable range")
    else:
        score += 0.05
        reasons.append("Height may limit opportunities")
    
    # Measurements scoring (proportions matter)
    if measurements:
        bust = measurements.get("bust", 0)
        waist = measurements.get("waist", 0)
        hips = measurements.get("hips", 0)
        
        if bust > 0 and waist > 0 and hips > 0:
            # Check for good proportions (waist should be smaller)
            if waist < bust and waist < hips:
                # Ideal proportions: waist is 60-70% of bust/hips
                waist_to_bust_ratio = waist / bust if bust > 0 else 1
                waist_to_hips_ratio = waist / hips if hips > 0 else 1
                
                if 0.6 <= waist_to_bust_ratio <= 0.75 and 0.6 <= waist_to_hips_ratio <= 0.75:
                    score += 0.2
                    reasons.append("Excellent body proportions")
                elif 0.55 <= waist_to_bust_ratio <= 0.8 and 0.55 <= waist_to_hips_ratio <= 0.8:
                    score += 0.15
                    reasons.append("Good body proportions")
                else:
                    score += 0.1
                    reasons.append("Proportions within range")
    
    # Photo quality scoring (if photos provided)
    if photos and len(photos) > 0:
        score += 0.1
        reasons.append(f"Portfolio with {len(photos)} photo(s)")
        if len(photos) >= 3:
            score += 0.05
            reasons.append("Complete portfolio")
    
    # Motivation text scoring (if provided)
    if motivation and len(motivation.strip()) > 20:
        score += 0.05
        reasons.append("Strong motivation statement")
    
    # Normalize score to 0.0-1.0 range
    score = min(1.0, max(0.0, score))
    
    # Determine category based on score
    if score >= 0.7:
        category = "perfectFit"
    elif score >= 0.4:
        category = "goodFit"
    else:
        category = "lowPotential"
    
    # If no reasons generated, add a default
    if not reasons:
        reasons = ["Profile under review"]
    
    return {
        "score": round(score, 2),
        "category": category,
        "reasons": reasons[:5]  # Limit to top 5 reasons
    }

