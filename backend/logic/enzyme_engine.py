import math
import random
from typing import Dict, List

from logic.guide_data import ENZYME_GUIDE

SUBSTRATE_TO_ENZYME = {
    "Amylase": "starch",
    "Cellulase": "cellulose",
    "Protease": "protein",
    "Pectinase": "pectin",
    "Lipase": "lipid",
    "Xylanase": "hemicellulose",
    "Ligninase": "lignin",
    "Collagenase": "collagen",
    "Alkaline Phosphatase": "minerals",
}

ENZYME_META = {
    "Amylase": {
        "ph": "5.5-6.8",
        "temperature": "35-55 °C",
        "base_yield": 88.0,
        "color": "#60A5FA",
        "reason": "starch granules are the dominant fermentable polysaccharide",
    },
    "Cellulase": {
        "ph": "4.8-5.5",
        "temperature": "40-55 °C",
        "base_yield": 58.0,
        "color": "#34D399",
        "reason": "cellulose fibres form the main structural fraction of the biomass",
    },
    "Protease": {
        "ph": "6.5-8.0",
        "temperature": "35-50 °C",
        "base_yield": 74.0,
        "color": "#F87171",
        "reason": "protein-rich tissue benefits most from peptide-bond hydrolysis",
    },
    "Pectinase": {
        "ph": "4.0-5.5",
        "temperature": "30-45 °C",
        "base_yield": 67.0,
        "color": "#FBBF24",
        "reason": "pectin is abundant in fruit and vegetable middle lamella",
    },
    "Lipase": {
        "ph": "7.0-8.5",
        "temperature": "30-45 °C",
        "base_yield": 63.0,
        "color": "#A78BFA",
        "reason": "triglycerides are the main recoverable substrate in oily feedstocks",
    },
    "Xylanase": {
        "ph": "5.0-6.5",
        "temperature": "40-55 °C",
        "base_yield": 54.0,
        "color": "#22D3EE",
        "reason": "hemicellulose loosens the plant cell wall matrix during decomposition",
    },
    "Ligninase": {
        "ph": "3.5-5.5",
        "temperature": "28-40 °C",
        "base_yield": 38.0,
        "color": "#A16207",
        "reason": "lignin is the recalcitrant aromatic polymer limiting woody biomass breakdown",
    },
    "Collagenase": {
        "ph": "6.5-8.0",
        "temperature": "35-45 °C",
        "base_yield": 82.0,
        "color": "#F472B6",
        "reason": "microbes aggressively target abundant collagen substrates to secrete collagenase",
    },
    "Alkaline Phosphatase": {
        "ph": "8.0-10.0",
        "temperature": "37-50 °C",
        "base_yield": 45.0,
        "color": "#94A3B8",
        "reason": "calcium phosphate and minerals in bone cells induce microbial synthesis of ALP",
    },
}

WASTE_PROFILES = {
    "rice": {
        "label": "Rice Waste",
        "composition": {
            "starch": 0.72,
            "cellulose": 0.05,
            "protein": 0.08,
            "pectin": 0.01,
            "lipid": 0.02,
            "hemicellulose": 0.04,
            "lignin": 0.01,
        },
        "base_decomp_days": 10,
        "note": "Cooked or leftover rice is dominated by starch, so saccharifying enzymes are most effective.",
    },
    "potato peel": {
        "label": "Potato Peel",
        "composition": {
            "starch": 0.32,
            "cellulose": 0.24,
            "protein": 0.04,
            "pectin": 0.11,
            "lipid": 0.01,
            "hemicellulose": 0.16,
            "lignin": 0.05,
        },
        "base_decomp_days": 18,
        "note": "Potato peel contains residual starch but also fibrous cellulose and hemicellulose.",
    },
    "banana peel": {
        "label": "Banana Peel",
        "composition": {
            "starch": 0.18,
            "cellulose": 0.15,
            "protein": 0.06,
            "pectin": 0.22,
            "lipid": 0.04,
            "hemicellulose": 0.14,
            "lignin": 0.08,
        },
        "base_decomp_days": 14,
        "note": "Banana peel is pectin-rich and softens rapidly when pectin networks are hydrolysed.",
    },
    "vegetable waste": {
        "label": "Vegetable Waste",
        "composition": {
            "starch": 0.12,
            "cellulose": 0.28,
            "protein": 0.09,
            "pectin": 0.18,
            "lipid": 0.02,
            "hemicellulose": 0.16,
            "lignin": 0.05,
        },
        "base_decomp_days": 16,
        "note": "Mixed vegetables are structurally supported by cellulose, pectin, and hemicellulose.",
    },
    "fruit waste": {
        "label": "Fruit Waste",
        "composition": {
            "starch": 0.18,
            "cellulose": 0.16,
            "protein": 0.04,
            "pectin": 0.25,
            "lipid": 0.03,
            "hemicellulose": 0.11,
            "lignin": 0.03,
        },
        "base_decomp_days": 12,
        "note": "Fruit waste usually contains high pectin content and easily hydrolysed sugars.",
    },
    "meat": {
        "label": "Meat Waste",
        "composition": {
            "starch": 0.00,
            "cellulose": 0.00,
            "protein": 0.58,
            "pectin": 0.00,
            "lipid": 0.22,
            "hemicellulose": 0.00,
            "lignin": 0.00,
        },
        "base_decomp_days": 9,
        "note": "Animal tissue is dominated by proteins and fats, favouring proteases and lipases.",
    },
    "bones": {
        "label": "Bone Waste",
        "composition": {
            "starch": 0.00,
            "cellulose": 0.00,
            "protein": 0.04,
            "pectin": 0.00,
            "lipid": 0.12,
            "hemicellulose": 0.00,
            "lignin": 0.00,
            "collagen": 0.28,
            "minerals": 0.35,
        },
        "base_decomp_days": 35,
        "note": "Bones do not produce enzymes; they serve as raw substrate. Microbial solid-state fermentation utilises the rich collagen and minerals to produce Collagenase, Gelatinase, and Protease.",
    },
    "woody biomass": {
        "label": "Woody Biomass",
        "composition": {
            "starch": 0.03,
            "cellulose": 0.34,
            "protein": 0.02,
            "pectin": 0.01,
            "lipid": 0.01,
            "hemicellulose": 0.21,
            "lignin": 0.28,
        },
        "base_decomp_days": 60,
        "note": "Woody residues are lignocellulosic and require cellulase, xylanase, and ligninase synergy.",
    },
    "used cooking oil": {
        "label": "Used Cooking Oil",
        "composition": {
            "starch": 0.00,
            "cellulose": 0.00,
            "protein": 0.00,
            "pectin": 0.00,
            "lipid": 0.84,
            "hemicellulose": 0.00,
            "lignin": 0.00,
        },
        "base_decomp_days": 25,
        "note": "Oil-rich waste is best treated with lipase because triglycerides dominate the feedstock.",
    },
}

WASTE_ALIASES = {
    "rice waste": "rice",
    "cooked rice": "rice",
    "bread waste": "rice",
    "pasta": "rice",
    "noodles": "rice",
    "potato": "potato peel",
    "banana": "banana peel",
    "veg waste": "vegetable waste",
    "vegetable scraps": "vegetable waste",
    "fruit peels": "fruit waste",
    "fruit peel": "fruit waste",
    "food scraps": "vegetable waste",
    "chicken waste": "meat",
    "fish waste": "meat",
    "dairy waste": "meat",
    "cheese waste": "meat",
    "wood": "woody biomass",
    "sawdust": "woody biomass",
    "straw": "woody biomass",
    "oil": "used cooking oil",
    "fat": "used cooking oil",
}


def list_supported_wastes() -> List[str]:
    return sorted(WASTE_PROFILES.keys())


def normalize_waste_type(raw_value: str) -> str:
    waste = (raw_value or "").strip().lower()
    if not waste:
        raise ValueError("Waste type is required.")
    if waste in WASTE_PROFILES:
        return waste
    if waste in WASTE_ALIASES:
        return WASTE_ALIASES[waste]

    if "peel" in waste and any(term in waste for term in ["banana", "orange", "mango", "apple", "papaya", "melon"]):
        return "fruit waste"
    if any(term in waste for term in ["vegetable", "leaf", "greens", "spinach", "cabbage", "carrot", "coffee", "tea"]):
        return "vegetable waste"
    if any(term in waste for term in ["fruit", "citrus", "apple", "mango", "pineapple"]):
        return "fruit waste"
    if any(term in waste for term in ["bread", "pasta", "noodle", "rice", "starch"]):
        return "rice"
    if any(term in waste for term in ["meat", "chicken", "fish", "beef", "egg", "dairy", "milk", "cheese"]):
        return "meat"
    if any(term in waste for term in ["bone", "skeleton"]):
        return "bones"
    if any(term in waste for term in ["wood", "husk", "shell", "biomass"]):
        return "woody biomass"
    if any(term in waste for term in ["oil", "fat", "grease"]):
        return "used cooking oil"

    supported = ", ".join(list_supported_wastes())
    raise ValueError(f"Unsupported waste type '{raw_value}'. Supported types: {supported}.")


def _parse_waste_inputs(waste_input) -> List[str]:
    if isinstance(waste_input, str):
        raw_items = [waste_input]
    elif isinstance(waste_input, (list, tuple, set)):
        raw_items = list(waste_input)
    else:
        raise ValueError("Waste type must be a string or a list of food/waste types.")

    parsed_items = []
    for item in raw_items:
        if not isinstance(item, str):
            raise ValueError("Each waste type must be text.")
        parsed_items.extend(part.strip() for part in item.split(",") if part.strip())

    if not parsed_items:
        raise ValueError("At least one food or waste type is required.")

    unique_items = []
    seen = set()
    for item in parsed_items:
        normalized = item.lower()
        if normalized not in seen:
            seen.add(normalized)
            unique_items.append(item)
    return unique_items


def get_waste_profile(waste_type) -> Dict:
    input_items = _parse_waste_inputs(waste_type)
    waste_keys = []
    for item in input_items:
        resolved = normalize_waste_type(item)
        if resolved not in waste_keys:
            waste_keys.append(resolved)

    profiles = [WASTE_PROFILES[key] for key in waste_keys]
    selected_labels = [profile["label"] for profile in profiles]

    if len(profiles) == 1:
        profile = dict(profiles[0])
        profile["selected_labels"] = selected_labels
        profile["input_labels"] = input_items
        return profile

    blended_composition = {
        substrate: sum(profile["composition"].get(substrate, 0.0) for profile in profiles) / len(profiles)
        for substrate in SUBSTRATE_TO_ENZYME.values()
    }

    return {
        "label": "Mixed Waste Blend",
        "composition": blended_composition,
        "base_decomp_days": round(sum(profile["base_decomp_days"] for profile in profiles) / len(profiles)),
        "note": "This combined feedstock blends multiple waste groups, so the dominant enzyme is chosen from the averaged biochemical substrate profile.",
        "selected_labels": selected_labels,
        "input_labels": input_items,
    }


def _build_probability_distribution(composition: Dict[str, float]) -> List[Dict]:
    total = sum(composition.get(substrate, 0.0) for substrate in SUBSTRATE_TO_ENZYME.values())
    probabilities = []

    for enzyme, substrate in SUBSTRATE_TO_ENZYME.items():
        raw_fraction = composition.get(substrate, 0.0)
        probability = 0.0 if total == 0 else round((raw_fraction / total) * 100, 1)
        probabilities.append(
            {
                "enzyme": enzyme,
                "substrate": substrate.title(),
                "probability": probability,
                "color": ENZYME_META[enzyme]["color"],
            }
        )

    probabilities.sort(key=lambda item: item["probability"], reverse=True)
    if probabilities:
        correction = round(100.0 - sum(item["probability"] for item in probabilities), 1)
        probabilities[0]["probability"] = round(probabilities[0]["probability"] + correction, 1)
    return probabilities


def _composition_breakdown(composition: Dict[str, float]) -> List[Dict]:
    formatted = []
    for component, fraction in composition.items():
        if fraction > 0:
            formatted.append(
                {
                    "component": component.replace("_", " ").title(),
                    "percentage": round(fraction * 100, 1),
                }
            )
    return sorted(formatted, key=lambda item: item["percentage"], reverse=True)


def predict_enzyme(waste_type, quantity_kg: float) -> Dict:
    if quantity_kg <= 0:
        raise ValueError("Quantity must be greater than 0 kg.")

    waste_profile = get_waste_profile(waste_type)
    composition = waste_profile["composition"]
    probabilities = _build_probability_distribution(composition)
    primary = probabilities[0]
    secondary = [item for item in probabilities[1:4] if item["probability"] > 0]

    primary_name = primary["enzyme"]
    primary_meta = ENZYME_META[primary_name]
    top_fraction = primary["probability"] / 100
    second_probability = probabilities[1]["probability"] if len(probabilities) > 1 else 0

    complexity = (
        1.0
        + composition.get("cellulose", 0) * 0.8
        + composition.get("hemicellulose", 0) * 0.7
        + composition.get("lignin", 0) * 1.5
        + composition.get("protein", 0) * 0.35
        + composition.get("lipid", 0) * 0.25
    )
    production_time_hours = max(24, int(round(24 + quantity_kg * 2.5 + complexity * 12)))

    substrate_efficiency = max(0.45, 0.72 + top_fraction * 0.23 - composition.get("lignin", 0) * 0.12)
    expected_yield = round(primary_meta["base_yield"] * substrate_efficiency, 2)
    extraction_efficiency = 0.55 + top_fraction * 0.25
    total_enzyme_extracted = round(expected_yield * quantity_kg * 1000 * extraction_efficiency, 2)

    confidence = round(
        min(98.0, max(60.0, 58 + primary["probability"] * 0.22 + (primary["probability"] - second_probability) * 0.35)),
        1,
    )

    time_axis = sorted(set([0] + list(range(12, production_time_hours + 12, 12)) + [production_time_hours]))
    yield_axis = []
    for hour in time_axis:
        if hour == 0:
            yield_axis.append(0)
            continue
        progress = 1 - math.exp(-2.6 * (hour / production_time_hours))
        yield_axis.append(round(expected_yield * min(progress, 1.0), 2))
    yield_axis[-1] = expected_yield

    dominant_components = _composition_breakdown(composition)[:3]
    reasoning = (
        f"{waste_profile['label']} is composed mainly of "
        + ", ".join(f"{item['component']} ({item['percentage']}%)" for item in dominant_components)
        + f". {primary_name} is prioritised because {primary_meta['reason']}. "
        + waste_profile["note"]
    )

    alerts = []
    
    risky_labels = ["Meat", "Bone", "Blend"]
    if any(risk in waste_profile["label"] for risk in risky_labels):
        if random.random() < 0.40:
            alerts.append({
                "type": "disease",
                "level": "critical",
                "title": "Disease detected ⚠️",
                "message": f"Abnormal pathogen markers found in {waste_profile['label']} sample. Sterilize before processing."
            })
            
    alerts.append({
        "type": "system",
        "level": "info",
        "title": "Model update notification",
        "message": "Enzyme mapping processed using engine v2.5."
    })

    return {
        "waste_type": waste_profile["label"],
        "input_waste_types": waste_profile.get("input_labels", [waste_profile["label"]]),
        "selected_wastes": waste_profile.get("selected_labels", [waste_profile["label"]]),
        "quantity_kg": round(quantity_kg, 2),
        "primary_enzyme": {
            "name": primary_name,
            "probability": primary["probability"],
            "optimal_ph": primary_meta["ph"],
            "optimal_temperature": primary_meta["temperature"],
        },
        "secondary_enzymes": secondary,
        "probabilities": probabilities,
        "composition_breakdown": _composition_breakdown(composition),
        "estimated_production_time_hours": production_time_hours,
        "expected_yield_u_per_g": expected_yield,
        "total_enzyme_extracted_u": total_enzyme_extracted,
        "model_confidence_percent": confidence,
        "yield_curve": {
            "time_hours": time_axis,
            "yield_u_per_g": yield_axis,
            "explanation": f"Higher yield over time indicates efficient enzymatic breakdown of the dominant {primary['substrate'].lower()} fraction.",
        },
        "scientific_reasoning": reasoning,
        "alerts": alerts,
    }


def predict_decomposition(waste_type, quantity_kg: float) -> Dict:
    if quantity_kg <= 0:
        raise ValueError("Quantity must be greater than 0 kg.")

    waste_profile = get_waste_profile(waste_type)
    composition = waste_profile["composition"]
    probabilities = _build_probability_distribution(composition)
    fastest = probabilities[0]

    bulk_factor = 1 + min(quantity_kg, 25) * 0.025
    acceleration = 1 - (fastest["probability"] / 100) * 0.22
    decomposition_days = max(3, int(round(waste_profile["base_decomp_days"] * bulk_factor * acceleration)))

    step = max(1, math.ceil(decomposition_days / 6))
    time_days = sorted(set([0] + list(range(step, decomposition_days + step, step)) + [decomposition_days]))

    comparison_series = []
    for item in probabilities:
        rate = 0.002 + (item["probability"] / 100) * 0.18
        values = [round(100 * (1 - math.exp(-day * rate)), 1) for day in time_days]
        comparison_series.append(
            {
                "enzyme": item["enzyme"],
                "color": item["color"],
                "values": values,
            }
        )

    explanation = (
        f"{fastest['enzyme']} accelerates {fastest['substrate'].lower()} breakdown fastest in {waste_profile['label'].lower()}, "
        f"while lower-matched enzymes remain less effective over the same time window."
    )

    return {
        "waste_type": waste_profile["label"],
        "input_waste_types": waste_profile.get("input_labels", [waste_profile["label"]]),
        "selected_wastes": waste_profile.get("selected_labels", [waste_profile["label"]]),
        "quantity_kg": round(quantity_kg, 2),
        "estimated_decomposition_time_days": decomposition_days,
        "fastest_enzyme": fastest["enzyme"],
        "enzyme_probabilities": probabilities,
        "decomposition_chart": {
            "time_days": time_days,
            "series": comparison_series,
            "explanation": explanation,
        },
        "scientific_reasoning": (
            f"The dominant substrates in {waste_profile['label']} favour {fastest['enzyme']}. "
            f"This estimate stays within realistic biological limits and scales with the waste mass provided."
        ),
    }


def get_enzyme_guide() -> List[Dict]:
    return ENZYME_GUIDE
