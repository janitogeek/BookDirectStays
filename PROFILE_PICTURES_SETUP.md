# Profile Pictures Setup for About Page

## Where to Add Profile Pictures

To add your profile pictures to the About page, place them in the following location:

```
client/public/uploads/
```

## Required Files

1. **Team Photo**: `elsa-jan-profile.jpg`
   - Place a photo of both Elsa and Jan together
   - Elsa should be on the left, Jan on the right
   - Recommended size: 400x400px or larger (will be displayed as 256x256px)
   - This is the main team photo displayed prominently

2. **Jan's Profile Picture**: `jan-profile.png`
   - Place your headshot image here
   - The image you provided will be used
   - Recommended size: 200x200px or larger (will be displayed as 128x128px)

3. **Elsa's Profile Picture**: `elsa-profile.jpg`
   - Place Elsa's headshot image here
   - Recommended size: 200x200px or larger (will be displayed as 128x128px)

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Minimum 200x200px (will be automatically resized and cropped)
- **Aspect Ratio**: Square or close to square (1:1 ratio works best)
- **Quality**: High quality, professional headshots

## How It Works

The About page will automatically:
- Display your profile pictures in circular frames
- Scale and crop images to fit the 80x80px display area
- Maintain aspect ratio while fitting the circular container
- Show a fallback icon if images are not found

## File Paths Used

- Team photo: `/uploads/elsa-jan-profile.jpg`
- Jan's image: `/uploads/jan-profile.png`
- Elsa's image: `/uploads/elsa-profile.jpg`

## After Adding Images

1. Place the images in the `client/public/uploads/` folder
2. Restart your development server if running
3. The images will appear automatically on the About page

## Fallback

If images are not found, the page will show placeholder icons instead, so the page will work even without the images initially.

