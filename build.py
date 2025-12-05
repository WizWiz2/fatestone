import os
import zipfile

def zip_game_files(output_filename='tavlei_yandex.zip'):
    # Files and directories to include
    include_extensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.txt', '.json']
    include_dirs = ['css', 'js', 'images']
    include_files = ['index.html'] # Explicitly include root files

    # Files/Dirs to exclude explicitly
    exclude_dirs = ['.git', '__pycache__', '.gemini', 'edge-profile']
    exclude_files = ['build.py', 'server.py', 'task.md', 'implementation_plan.md', 'walkthrough.md', 'YANDEX_GUIDE.md']

    print(f"Creating archive: {output_filename}...")
    if os.path.exists(output_filename):
        try:
            os.remove(output_filename)
        except OSError as e:
            print(f"Error removing old zip: {e}")
            return

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add root files
        for file in include_files:
            if os.path.exists(file):
                print(f"Adding: {file}")
                zipf.write(file)
            else:
                print(f"Warning: {file} not found!")

        # Add directories
        for dir_name in include_dirs:
            if not os.path.exists(dir_name):
                print(f"Warning: Directory {dir_name} not found, skipping.")
                continue
            
            for root, dirs, files in os.walk(dir_name):
                # Remove excluded directories from traversal
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                
                for file in files:
                    if file in exclude_files:
                        continue
                    
                    # Check extension if needed, or just add all in these dirs
                    # For now, let's add everything in css/js/img unless excluded
                    file_path = os.path.join(root, file)
                    # Force forward slashes for zip archive compatibility (Linux/Web)
                    arcname = file_path.replace(os.sep, '/')
                    print(f"Adding: {file_path} as {arcname}")
                    zipf.write(file_path, arcname)

    print(f"\nDone! Archive created: {os.path.abspath(output_filename)}")

if __name__ == "__main__":
    zip_game_files()
