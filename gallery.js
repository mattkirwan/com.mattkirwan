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
 * Note: the two files here are AVIF. They were committed as .jpg,
 * which served them under the wrong content type; they now carry the
 * .avif extension that matches their actual format.
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
          src: "images/01.avif",
          w: 1024,
          h: 684,
          title: "",
          location: "",
          year: ""
        },
        {
          src: "images/02.avif",
          w: 684,
          h: 1024,
          title: "",
          location: "",
          year: ""
        }
      ]
    }
  ]
};
