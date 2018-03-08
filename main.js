var researchArchiveURL = 'https://docs.google.com/spreadsheets/d/1ianZrHebWkj2aKhOhkRbsk5p_4BvL__aImo6iuvADh4/pubhtml';

function unifyDescription(t, a, r, p) {
  title = !!t ? "<h4>"+t+"</h4>" : '';
  abs = !!a ? "<p>Abstract:<br/>"+a+"</p>" : '<p>Unavailable</p>';
  pub = formatRepoURL(r);
  pos = formatPosterURL(p);
  return title + abs + pub + pos;
}

function formatPosterURL(url, showErr) {
  if (!url) return !!showErr ? 'Unavailable' : '';
  return '<p><a target="_blank" href='+url+'>View poster</a> <a style="text-decoration: none;"href='+url+'><i class="fas fa-external-link-alt"></i></a></p>';
}

function formatRepoURL(url, showErr) {
  if (!url) return !!showErr ? 'Unavailable' : '';
  Meta = ['<p>View Thesis:<br/>', '<p>View Theses:<br/>']
  Head = '<a target="_blank" href=';
  Mid = '</a> <a style="text-decoration: none;" href="';
  Tail = '"><i class="fas fa-external-link-alt"></i></a>';
  // handles only one link
  if (!~url.indexOf(';'))
    return Meta[0] + Head + url + '>' + url + Mid + url + Tail + '</p>';
  // handles multiple comma-separated links
  tagToReturn =Meta[1];
  url.split(';').forEach(function (l){l=l.trim();tagToReturn += Head+l+'>'+l+Mid+l+Tail+"<br/>";});
  tagToReturn += '</p>';
  return tagToReturn;
}

/*
 * Reformat year from say, 2018-2019, to 2018-19
 */
function reformatYear(year) {
  return /^\d{4}-\d{4}$/.test(year) ? year.slice(0,5)+year.slice(7,9) : year;
}


var table;

$(document).ready(function() {
  var processedData = [];

  function processData(data, tabletop) {
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
        unifyDescription(r['Title'], r.Abstract, r.Repository, r.Poster),
      ]);
    }

    // Transform <table> element into fancy DataTables element
    table = $('#results').DataTable({
      paging: false,
      info: false,
      ordering: true,
      data: processedData,
      searchHighlight: true, // this relies on highlight jQuery plugin, as well as DataTables Highlight plugin
      columns: [
        {title: 'Year', width: '45px'},
        {title: 'Author', width: '20px'},
        {title: 'Partner', width: '30px'},
        {title: 'Subjects', width: '20px'},
        {title: 'Project', orderable: false},
      ],
      "order": [[0, "desc"]]
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
  ].map(function(x) {
    // Creating checkboxes in DOM
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

  // Initialize Tabletop
  Tabletop.init({
    'key': researchArchiveURL,
    'callback': processData,
    'simpleSheet': true,
  });

  // Open and close the dropdown menu with checkboxes on Subjects button click
  $('#filtersButton').click(function() {
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
