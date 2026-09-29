"""
Pipeline de données SignLive
- Fusionne les sources ASL
- Déduplique par hash MD5
- Split reproductible (seed=42)
- Génère data/processed/data.yaml
"""
import os
import shutil
import hashlib
from pathlib import Path
from sklearn.model_selection import train_test_split
import yaml

# Chemins
RAW_DIR = Path("data/raw/asl_letters")
PROCESSED_DIR = Path("data/processed")
SEED = 42

# Classes A-Z
CLASSES = [chr(i) for i in range(ord("A"), ord("Z") + 1)]


def get_image_hash(image_path: Path) -> str:
    """Hash MD5 pour détecter les doublons."""
    with open(image_path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def collect_samples(raw_dir: Path) -> list:
    """Collecte toutes les paires (image, label)."""
    samples = []
    for split in ["train", "valid", "test"]:
        img_dir = raw_dir / split / "images"
        lbl_dir = raw_dir / split / "labels"
        if not img_dir.exists():
            continue
        for img_path in sorted(img_dir.glob("*.jpg")):
            lbl_path = lbl_dir / img_path.with_suffix(".txt").name
            if lbl_path.exists():
                samples.append({"image": img_path, "label": lbl_path})
    print(f"✅ {len(samples)} paires image/label collectées")
    return samples


def deduplicate(samples: list) -> list:
    """Supprime les doublons par hash MD5."""
    seen = set()
    unique = []
    for s in samples:
        h = get_image_hash(s["image"])
        if h not in seen:
            seen.add(h)
            unique.append(s)
    removed = len(samples) - len(unique)
    print(f"✅ {len(unique)} samples uniques (supprimé {removed} doublons)")
    return unique


def copy_samples(samples: list, dest_dir: Path, split_name: str):
    """Copie les images et labels dans dest_dir/split_name."""
    img_dir = dest_dir / split_name / "images"
    lbl_dir = dest_dir / split_name / "labels"
    img_dir.mkdir(parents=True, exist_ok=True)
    lbl_dir.mkdir(parents=True, exist_ok=True)
    for s in samples:
        shutil.copy(s["image"], img_dir / s["image"].name)
        shutil.copy(s["label"], lbl_dir / s["label"].name)
    print(f"✅ {len(samples)} samples copiés dans {split_name}/")


def generate_yaml(dest_dir: Path):
    """Génère data.yaml pour YOLO."""
    config = {
        "train": str((dest_dir / "train" / "images").resolve()),
        "val": str((dest_dir / "valid" / "images").resolve()),
        "test": str((dest_dir / "test" / "images").resolve()),
        "nc": 26,
        "names": CLASSES,
    }
    yaml_path = dest_dir / "data.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(config, f, default_flow_style=False)
    print(f"✅ data.yaml généré : {yaml_path}")


def main():
    print("🚀 Démarrage du pipeline SignLive")

    # 1. Collecter
    samples = collect_samples(RAW_DIR)

    # 2. Dédupliquer
    samples = deduplicate(samples)

    # 3. Split reproductible
    train_val, test = train_test_split(samples, test_size=0.15, random_state=SEED)
    train, valid = train_test_split(train_val, test_size=0.176, random_state=SEED)

    print(f"📊 Split final : train={len(train)}, valid={len(valid)}, test={len(test)}")

    # 4. Nettoyer processed/
    if PROCESSED_DIR.exists():
        shutil.rmtree(PROCESSED_DIR)
    PROCESSED_DIR.mkdir(parents=True)

    # 5. Copier
    copy_samples(train, PROCESSED_DIR, "train")
    copy_samples(valid, PROCESSED_DIR, "valid")
    copy_samples(test, PROCESSED_DIR, "test")

    # 6. Générer data.yaml
    generate_yaml(PROCESSED_DIR)

    print("🎉 Pipeline terminé !")


if __name__ == "__main__":
    main()