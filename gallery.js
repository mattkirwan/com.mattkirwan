/*
 * Site content.
 *
 * This is the only file you need to edit to add photographs.
 * It is plain JavaScript (not JSON) so it works when you open
 * index.html directly from disk, with no server and no build step.
 *
 * To add a photo:
 *   1. Drop the file into images/ (jpg, avif and webp all work)
 *   2. Add an entry to the `photos` array below.
 *
 * `w` and `h` are the pixel dimensions of the file. They are used to
 * reserve the right amount of space before the image loads, so the
 * grid does not jump around while scrolling. Find them with:
 *
 *   sips -g pixelWidth -g pixelHeight images/yourphoto.jpg
 *
 * Each photograph is stored at two sizes. `src` is the full 2000px
 * version shown in the lightbox; `thumb` is the 900px version the grid
 * loads, which keeps the page light. Generate both with:
 *
 *   sips -Z 2000 -s format jpeg -s formatOptions 82 SOURCE --out images/name.jpg
 *   sips -Z 900  -s format jpeg -s formatOptions 80 SOURCE --out images/thumbs/name.jpg
 *
 * Keep filenames URL-safe: lowercase, hyphens, and no '#' (a browser
 * reads '#' as the start of a URL fragment, so the image would 404).
 *
 * `title`, `location` and `year` are all optional.
 */

window.SITE = {
  name: "Matt Kirwan",
  tagline: "Photography",

  /*
   * Each entry here is a project. Today the site shows one.
   * Adding another to this array is all that is needed to add a
   * second body of work -- the nav and routing pick it up on their own.
   */
  projects: [
    {
      slug: "selected",
      title: "Selected Work",
      description: "",
      photos: [
        {
          src: "images/20260905-horse-and-trap.jpg",
          thumb: "images/thumbs/20260905-horse-and-trap.jpg",
          w: 2000,
          h: 1336,
          alt: "A horse and trap racing along a terraced street, the background blurred by the pan",
          title: "",
          location: "",
          year: ""
        },
        {
          src: "images/20250821-durham-miners-gala.jpg",
          thumb: "images/thumbs/20250821-durham-miners-gala.jpg",
          w: 2000,
          h: 1333,
          alt: "A couple in camping chairs sharing a drink above the crowd at the Durham Miners Gala",
          title: "Durham Miners Gala",
          location: "",
          year: ""
        },
        {
          src: "images/20250627-kites-beach.jpg",
          thumb: "images/thumbs/20250627-kites-beach.jpg",
          w: 2000,
          h: 1336,
          alt: "A small child stands with a spade on a wide beach as kites fly overhead",
          title: "",
          location: "",
          year: ""
        }
      ]
    }
  ]
};
