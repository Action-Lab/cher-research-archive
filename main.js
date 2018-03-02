var researchArchiveURL = 'https://docs.google.com/spreadsheets/d/1ianZrHebWkj2aKhOhkRbsk5p_4BvL__aImo6iuvADh4/pubhtml';

Tabletop.init({
  key: researchArchiveURL,
  callback: processData,
  simpleSheet: true,
});

/* functionality authored by Ilya. Probably won't need this for this project.
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
  return '<a target="_blank" href="mailto:' + email + '"><i class="fa fa-envelope"></i> </a>'
}
*/

function formatPosterURL(url, showErr){
  if (!url) return !!showErr ? 'Unavailable' : '';
  return '<a target="_blank" href='+url+'>Click to see poster</a> <a style="text-decoration: none;"href='+url+'><i class="fas fa-external-link-alt"></i></a>';
}

function mergeAbstractAndRepoURL(a, r){
  abs = !!a ? "<p>"+a+"</p>" : '<p>Unavailable</p>';
  pub = !!r ? '<p>Associated Theses:<br/>'+ formatRepoURL(r) + '</p>' : '';
  return abs + pub;
}

function formatRepoURL(url, showErr){
  if (!url) return !!showErr ? 'Unavailable' : '';
  Head = '<a target="_blank" href=';
  Mid = '</a> <a style="text-decoration: none;" href="';
  Tail = '"><i class="fas fa-external-link-alt"></i></a>';
  // handles only one link
  if (!~url.indexOf(';'))
    return Head + url + '>' + url + Mid + url + Tail;
  // handles multiple comma-separated links
  tagToReturn ='';
  url.split(';').forEach(function (l){l=l.trim();tagToReturn += Head+l+'>'+l+Mid+l+Tail+"<br/>";});
  console.log(tagToReturn);
  return tagToReturn;
}

/*
 * Reformat year from say, 2018-2019, to 2018-19
 */
function reformatYear(year){
  return /^\d{4}-\d{4}$/.test(year) ? year.slice(0,5)+year.slice(7,9) : year;
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
      reformatYear(r.Year),
      mergeAbstractAndRepoURL(r.Abstract, r.Repository),
      formatPosterURL(r.Poster,"poster", 1),
      //linkToAnchor(r.Repository, "publication", 1),
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
        {title: 'Author', width: '20px'},
        {title: 'Title',  width: '200px'},
        {title: 'Partner', width: '30px', className: 'td-center'},
        {title: 'Year', width:'45px'},
        {title: 'Abstract', orderable: false},
        {title: 'Poster', orderable: false},
        //{title: 'Repository Publication', orderable: false},
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
