import zipfile
import os

zip_name = 'tavlei_yandex.zip'

if not os.path.exists(zip_name):
    print(f"Error: {zip_name} not found!")
else:
    print(f"Inspecting {zip_name}...")
    with zipfile.ZipFile(zip_name, 'r') as zipf:
        for info in zipf.infolist():
            print(f"{info.filename}")
