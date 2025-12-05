from PIL import Image
import os

def resize_image(input_path, output_path, target_size):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    try:
        with Image.open(input_path) as img:
            # Resize using LANCZOS for high quality
            resized_img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            resized_img.save(output_path, "PNG")
            print(f"Success: Resized {input_path} to {target_size} and saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def main():
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(base_dir, 'images')
    dest_dir = os.path.join(base_dir, 'img') # Using 'img' as per original plan/build script

    # Ensure source exists
    if not os.path.exists(src_dir):
        print(f"Source directory {src_dir} not found.")
        return

    # 1. Icon: 512x512
    resize_image(
        os.path.join(src_dir, 'icon.png'),
        os.path.join(dest_dir, 'icon.png'),
        (512, 512)
    )

    # 2. Cover: 800x470
    resize_image(
        os.path.join(src_dir, 'cover.png'),
        os.path.join(dest_dir, 'cover.png'),
        (800, 470)
    )
    
    # 3. Screenshots (Optional but good to move)
    # Just copying them or resizing if needed. For now let's just handle icon/cover.

if __name__ == "__main__":
    main()
