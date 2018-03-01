//var researchArchiveURL = 'https://docs.google.com/spreadsheets/d/1p8r5qRrLbDJp1tmBXvZow9ygzn2EVv3f_m0lgONC1HE/pubhtml';
var researchArchiveURL = 'https://docs.google.com/spreadsheets/d/1ianZrHebWkj2aKhOhkRbsk5p_4BvL__aImo6iuvADh4/pubhtml';

Tabletop.init({
  key: researchArchiveURL,
  callback: processData,
  simpleSheet: true,
});

function mergeNameAndWebsite(name, website) {
  if (!website) { return name; }
  return '<span class="invisible">' + name + '</span>'
    + '<a target="_blank" href="http://' + website + '">' + name + '</a>';
}

function mergeTitleResearchNeeds(title, research, needs) {
  res = '';
  if (title) {
    res += '<h3>' + title + '</h3>';
  }

  res += '<p><span class="emphasis">Research Project: </span>' + research + '</p>';

  if (needs) {
    res += '<p><span class="emphasis">Student Researchers: </span>' + needs + '</p>';
  }

  return res;
}


function emailToLink(email) {
  if (!email) { return ''; }
  return ' <a href="mailto:' + email + '"><i class="fa fa-envelope"> </a>'
}

function linkToAnchor(link, showErr){
  if (!link) return !!showErr ? 'Unavailable' : '';
  return '<a href='+link+'>Click to see poster</a> <a style="text-decoration: none;"href='+link+'<i class="fas fa-external-link-alt"></a>';
}

function parseRepoLink(link, showErr){
  if (!link) return !!showErr ? 'Unavailable' : '';
  if (!~link.indexOf(';'))
    return '<a href='+link+'>'+link+'</a> <a style="text-decoration: none;" href='+link+'<i class="fas fa-external-link-alt"></a>';
  tagToReturn ='';
  Head = '<a href=';
  Mid = '</a> <a style="text-decoration: none;" href=';
  Tail = '<i class="fas fa-external-link-alt"></a>';
  link.split(';').forEach(function (l){tagToReturn += Head+link+'>'+l+Mid+link+Tail+"<br/>";});
  return tagToReturn;
}


function processData(data, tabletop) {
  if (!data[0]) return;

  var processedData = [];

  for (i in data) {
    var r = data[i];
    //if (r.Display !== 'y') continue;

    // Add a row to the final dataset
    processedData.push([
      r.Author,
      r["Title "] || "Unavailable",
      r.Partner,
      r.Year,
      r.Abstract || 'Unavailable',
      linkToAnchor(r.Poster, 1),
      parseRepoLink(r.Repository, 1),
    ]);
  }

  // Adding custom filtering
  /*
  $.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {

      // This is a JavaScript object whose keys will
      // be the checked values (e.g. Arts, "Social Sciences")
      showOnly = {};

      $('input:checkbox:checked').each(function() {
        showOnly[this.value] = 1;
      });

      var divisions = data[2].split(',').map(function(x) {return x.trim()});

      for (i in divisions) {
        if (showOnly[divisions[i]] === 1) {
          return true;
        }
      }
      return false;
    }
  );
  */


  $(document).ready(function() {
    var table = $('#results').DataTable({
      paging: false,
      info: false,
      ordering: true,
      data: processedData,
      columns: [
        {title: 'Author', width: '30px', className: 'td-center'},
        {title: 'Title',  width: '50px'},
        {title: 'Partner', width: '30px', className: 'td-center'},
        {title: 'Year'},
        {title: 'Abstract', orderable: false},
        {title: 'Poster', orderable: false},
        {title: 'Repository Publication', orderable: false},
      ]
    });

    $('input[name="filter"]').change(function() {
      table.draw();
    });

  });

  var filters = [
    ['Arts', 'Art'],
    ['Community Development', 'Comm.Devel.'],
    ['Education', 'Edu'],
    ['Environment', 'Env'],
    ['Food', 'Food'],
    ['Health', 'Health'],
    ['Hispanic Studies', 'Hisp.Stu.'],
    ['Housing', 'Housing'],
    ['Human Rights', 'Hum.Rghts.'],
    ['Immigration', 'Immig.'],
    ['Religion', 'Relg.'],
    ['Science', 'Sci'],
    ['Sustainability', 'Sust.'],
  ]

  function renameCheckboxes() {
    var shorten = $(window).width() < 900 ? 1 : 0;
    $('#filters label').each(function(i) {
      $(this).text(filters[i][shorten])
    });
  }

  $(window).resize(renameCheckboxes);
  renameCheckboxes();
}
