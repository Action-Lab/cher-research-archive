// Link to the Google Sheets with data
// Needs to be published to the web as a CSV
var researchArchiveURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXUGmvoyLVXl9niXmDIYAX51eeDvpsYdFQn5flNgciPGtCozSESCVA43WqQCXI3K0gx4cRQfQV11xn/pub?gid=0&single=true&output=csv';


/*
 * Returns a single HTML block for all project description
 * elements combined
 */
function unifyDescription(t, ty, a, r, p) {

  // Project title
  var title = !!t ? '<h4>'+t+'</h4>' : '';

  // Project type
  var ty = '<span class="research-type">' + ty + '</span>';

  // Project abstract
  var abs = !!a ? "<p><b>Abstract:</b><br/>"+a+"</p>" : '<p>Unavailable</p>';

  // Project weblinks (can be more than one)
  var pub = formatRepoURL(r);

  // Poster weblink (only one)
  var pos = formatPosterURL(p);

  return title + ty + abs + pub + pos;
}


/*
 * Returns HTML code for poster URL
 */
function formatPosterURL(url) {
  return !url
    ? 'Unavailable'
    : '<p><a target="_blank" href='+url+'>\
      View poster<i class="fas fa-external-link-alt"></i></a></p>';
}


/*
 * Returns HTML code for repository URLs (multiple if separated by `;`)
 */
function formatRepoURL(url) {
  if (!url) return 'Unavailable';

  tagToReturn = '<p>View Online:';

  url.split(';').forEach(function(l) {
    l = l.trim();
    tagToReturn +=
      '<br><a target="_blank" href=' + l + '>' + l
        + '<i class="fas fa-external-link-alt"></i></a>';
  });

  tagToReturn += '</p>';

  return tagToReturn;
}


/*
 * Reformats year from YYYY-YYYY to YYYY-YY
 * e.g. 2021-2022 becomes 2021-22
 */
function reformatYear(year) {
  return /^\d{4}-\d{4}$/.test(year) ? year.slice(0,5)+year.slice(7,9) : year;
}


// Global variable for the DataTables table
var table;


$(document).ready(function() {
  var processedData = [];

  function processData(data) {
    if (!data[0]) return;

    for (i in data) {
      var r = data[i];
      if (!r['Title']) continue;

      // Add a row to the final dataset
      processedData.push([
        reformatYear(r.Year),
        r.Author,
        r.Partner,
        r.Subjects,
        unifyDescription(r.Title, r.Type, r.Abstract, r.Online, r.Poster),
        r.Type, // for the invisible column = Project dropdown filter
      ]);
    }

    // Transform <table> element into fancy DataTables element
    $('#spinner').css('display', 'none');
    table = $('#results').DataTable({
      paging: false,
      info: false,
      ordering: true,
      data: processedData,
      searchHighlight: true, // this relies on highlight jQuery plugin, as well as DataTables Highlight plugin
      columns: [
        {title: 'Year', width: '45px'},
        {title: 'Author(s)', width: '20px'},
        {title: 'Partner', width: '30px'},
        {title: 'Subjects', width: '20px'},
        {title: 'Project', orderable: false},
        {title: 'Type', visible: false}
      ],
      "order": [[0, "desc"]],

      // Add dropdown filter by Research Type
      initComplete: function () {
          this.api().columns([5]).every( function () {
            var column = this;
            var select = $('<select><option value="">Project Type</option></select>')
              .appendTo( $(this.columns([4]).header()) )
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search( val ? '^'+val+'$' : '', true, false )
                  .draw();
              });
            column.data().unique().sort().each( function (d, j) {
              d == '' ? false : select.append( '<option value="'+d+'">'+d+'</option>' );
            });
          });
        }


    });
  }

  // List of checkboxes to be added to the Topics list
  var filters = [
    'Arts',
    'Community Development',
    'Education',
    'Environment',
    'Food',
    'Health',
    'Hispanic Studies',
    'Housing',
    'Human Rights',
    'Immigration',
    'Religion',
    'Science',
    'Sustainability',
  ]
  
  // For each filter, add checkbox
  filters.map(function(x) {
    var name = x.split(' ')[0].toLowerCase();
    $('#filtersCheckboxes').append('<input type="checkbox" \
      id="' + name + '" name="' + name + '" value="' + x + '" checked>\
      <label for="' + name + '">' + x + '</label><br>');
  });


  // Adding custom Subjects filtering
  $.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {

      // This is a JavaScript object whose keys will
      // be the checked values (e.g. Arts, "Social Sciences")
      showOnly = {};

      $('input:checkbox:checked').each(function() {
        showOnly[this.value] = 1;
      });

      var divisions = data[3].split(';').map(function(x) { return x.trim() });

      for (i in divisions) {
        if (showOnly[divisions[i]] === 1) {
          return true;
        }
      }
      return false;
    }
  );


  // Fetch Google Sheets published as CSV using PapaParse
  Papa.parse(researchArchiveURL, {
    download: true,
    header: true,
    complete: function(result) {
      processData(result.data);
    }
  });


  // Enable filter dropdown
  $('#filtersButton, #filtersCheckboxes, #filterHelpers').hover(function() {
    if ( $('#filtersCheckboxes').hasClass('invisible') ) {
      $('#filtersCheckboxes, #filterHelpers').removeClass('invisible').addClass('visible');
    } else {
      $('#filtersCheckboxes, #filterHelpers').removeClass('visible').addClass('invisible');
    }
  });

  // When user selects or deselects a checkbox, update the table
  $('#filtersCheckboxes>input').change(function() {
    table.draw();
  });

  // When removeAll is clicked, de-select all filter checkboxes
  $('#removeAll').click(function() {
    $('input:checkbox').prop('checked', false);
    table.draw();
  });

  // When selectAll is clicked, select all filter checkboxes
  $('#selectAll').click(function() {
    $('input:checkbox').prop('checked', true);
    table.draw();
  });

});
