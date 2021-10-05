# CHER Research Archive
Displays Google Sheet data in a searchable, filterable, and sortable manner.

## Live website
https://action-lab.github.io/research-archive/

or see code manually pasted into:

https://cher.trincoll.edu/research-archive/

## Data on Google Drive
- https://drive.google.com/drive/folders/1PJ1wabDbNwQJKfxrr7pCAnC7aNq81E-a
- see this published Google Sheet
- https://docs.google.com/spreadsheets/d/1ianZrHebWkj2aKhOhkRbsk5p_4BvL__aImo6iuvADh4

## Data entry
- Always add most RECENT data to the TOP of the Google Sheet, and paste into the following columns:
- Year (use only the year of publication, not month or semester)
- Author (separate multiple authors with commas)
- Title
- Type (use consistent labels:  Liberal Arts Action Lab, Community Learning Research Fellows. New labels can be added in the future, since the Project Type drop-down menu on the public web page auto-populates from this data column).
- Partner (use organization name when possible, and try to be consistent with past ones)
- Abstract (make sure that Action Lab and CLRF director/coordinator have reviewed the text)
- Subjects (separate entries with semi-colons; try to be consistent with existing labels, which are listed in Subjects button in public web page. New subjects can be added, since this button auto-populates from this data column)
- Online (paste web link if research products are on the public web, such as Action Lab sub-site, or paper uploaded to Trinity Library Digital Repository, which students do if their work also is a senior research project)
- Poster (for CL RFellows: name poster in this format (Lastname Year.PDF), upload to Google Drive posters subfolder [or start a new subfolder], right-click Get Shareable Link, and paste link into column)
- NOTE: Each entry can have BOTH online links AND poster links.
- Ignore other columns (labeled “not used”) because they do not appear on the public web site.
- When you finish data entry, check the public website to make sure it displays properly

## Requirements
- data in Google Sheets, which must be published. Insert URLs in main.js
- See [here](https://github.com/jsoma/tabletop#if-your-publish-to-web-url-doesnt-work) for errors.

## Code hosting
- Go to action-lab account on Reclaim Hosting > cPanel > File Manager > cher.trincoll.edu > research-archive
- any code updates on GitHub must be manually uploaded to the folder above

## Credits
Created by Ilya Ilyankou ([@ilyankou](https://github.com/ilyankou)) with Zorawar Moolenaar ([@zorawar87](https://github.com/zorawar87)) for the Center for Hartford Engagement and Research (CHER) at Trinity College, Hartford CT (http://cher.trincoll.edu)

## Dependencies
* [Papa Parse v5](https://www.papaparse.com)
* [jQuery v3.2.1](https://jquery.com/)
* [jQuery Highlight plugin](https://github.com/bartaz/sandbox.js)
* [DataTables v1.10.16](https://www.datatables.net/)
* [DataTables Highlight plugin](https://github.com/DataTables/Plugins/tree/master/features/searchHighlight)
* [Font-Awesome v5.0.7](https://fontawesome.com/)
