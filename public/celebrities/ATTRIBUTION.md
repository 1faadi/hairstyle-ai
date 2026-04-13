# Celebrity portrait images (licensing)

In production, these files are typically uploaded to Cloudinary (`npm run upload:celebrities`) and served from `res.cloudinary.com` via `NEXT_PUBLIC_CLOUDINARY_*` env vars; the copies in `public/celebrities/` remain the source of truth for uploads and local fallback.

These JPEGs are copied from **Wikimedia Commons** under the licenses listed below.  
Do not use them in ways that imply endorsement by the people shown. See each Commons file page for personality rights notices.

| Local file | Subject | License | Source |
|------------|---------|---------|--------|
| `margot-robbie.jpg` | Margot Robbie (cropped from premiere photo) | CC BY-SA 4.0 / GFDL | [File:Margot Robbie 2019 by Glenn Francis (cropped).jpg](https://commons.wikimedia.org/wiki/File:Margot_Robbie_2019_by_Glenn_Francis_(cropped).jpg) — Glenn Francis |
| `brad-pitt.jpg` | Brad Pitt (cropped) | CC BY-SA 4.0 / GFDL | [File:Brad Pitt 2019 by Glenn Francis (cropped).jpg](https://commons.wikimedia.org/wiki/File:Brad_Pitt_2019_by_Glenn_Francis_(cropped).jpg) — Glenn Francis |
| `leonardo-dicaprio.jpg` | Leonardo DiCaprio | CC BY-SA 2.0 | [File:Leonardo DiCaprio (29736977296).jpg](https://commons.wikimedia.org/wiki/File:Leonardo_DiCaprio_(29736977296).jpg) — GabboT / Flickr |
| `tom-cruise.jpg` | Tom Cruise | CC BY-SA 3.0 | [File:Tom Cruise by Gage Skidmore.jpg](https://commons.wikimedia.org/wiki/File:Tom_Cruise_by_Gage_Skidmore.jpg) — Gage Skidmore |
| `sydney-sweeney.jpg` | Sydney Sweeney | CC BY-SA 4.0 / GFDL | [File:Sydney Sweeney 2019 by Glenn Francis.jpg](https://commons.wikimedia.org/wiki/File:Sydney_Sweeney_2019_by_Glenn_Francis.jpg) — Glenn Francis |
| `deepika-padukone.jpg` | Deepika Padukone | CC BY-SA 3.0 | [File:Deepika Padukone Cannes 2018 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Deepika_Padukone_Cannes_2018_(cropped).jpg) — Georges Biard |

500px-width thumbnails were used where noted on Commons to keep file sizes suitable for the app.
