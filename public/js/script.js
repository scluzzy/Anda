// Form validation code will come here.
function categoryvalidate() {      
  if( document.ideaForm.idea[category].value == "" ) {
      alert( "Please provide your category!" );
      document.ideaForm.idea[category].focus() ;
      return false;
  }
  if( document.ideaForm.idea[subcategory].value == "" ) {
      alert( "Please provide subcategory!" );
      document.ideaForm.idea[category].focus() ;
      return false;
  }
}

$('.counter-count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 5000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

if ($(window).width() > 992) {
  $(window).scroll(function(){  
     if ($(this).scrollTop() > 40) {
        $('#navbar').addClass("fixed-top");
//         add padding top to show content behind navbar
        $('.content').css('padding-top', $('.navbar').outerHeight() +'px');
      }else{
        $('#navbar_top').removeClass("fixed-top");
         // remove padding top from body
        $('body').css('padding-top', '0');
      }   
  });
} // 
$(window).on("load", function () {
  jQuery("#status").fadeOut("slow");
  $("#preloader").delay(250).fadeOut("slow");
  $("body").delay(250).css({ overflow: "visible" });
});
jQuery(document).ready(function () {
  "use strict";
  $(".hey").ripples({ dropRadius: 15, perturbance: 0.01 });
  
});
var table = document.getElementById("basic-data-table");

function myCreateFunction() {

  var i = table.rows.length;
  var row = table.insertRow(i);

  for (var j = 0; j < table.rows[0].cells.length - 1; j++) {
    var cell = row.insertCell(j);
    cell.innerHTML = "new name" + i + j;
    table.rows[i].cells[j].addEventListener("click", function() {
      editText(this);
    }, false);
  }

  var cell = row.insertCell(row.cells.length);
  cell.innerHTML = "🗑️";
  cell.classList.add("delete_row");
  cell.addEventListener("click", function() {
    deleteRow(this);
  }, false);
}

function deleteRow(r) {
  var i = r.parentNode.rowIndex;
  document.getElementById("basic-data-table").deleteRow(i);
}

if (table != null) {
  for (var i = 0; i < table.rows.length; i++) {
    for (var j = 0; j < table.rows[i].cells.length - 1; j++) {
      table.rows[i].cells[j].addEventListener("click", function() {
        editText(this);
      }, false);
    }
    var n = table.rows[i].cells.length - 1;
    table.rows[i].cells[n].addEventListener("click", function() {
        deleteRow(this);
      }, false);
  }
}

function editText(tableCell) {
  var txt = tableCell.innerText || tableCell.textContent;
  tableCell.innerText = tableCell.textContent = "";
  var input = document.createElement("input");
  input.type = "text";
  tableCell.appendChild(input);
  input.value = txt;
  input.focus();
  input.onblur = function() {
    tableCell.innerText = input.value;
    tableCell.textContent = input.value;
  }
}

function leaveCell(tableCell) {
  tableCell.innerText = input.value;
  tableCell.textContent = input.value;
}
$(document).ready(function() {
      $('#addRow').on('click', function() {
        var trHtml = $('#tr_tmpl').html();        
        var tr = $('<tr>' + trHtml + '</tr>');
        $('#tableBody').append(tr);

        tr.find('a.delete').on('click', function() {  
          tr.remove();  
          reIndex();
        });

        reIndex();  

        function reIndex() {
          var rows = $('tbody tr');
          rows.each(function(i, row){
            $(row).find('.userId').html(i + 1);
          });
        }

        var action = $(tr).find('.action');

        action.on('click', function() {
          onActionHandler();  
        }) 

        function onActionHandler() {
          var name  = $(tr).find('.name');
          var city  = $(tr).find('.city');
          var state = $(tr).find('.state');
          var mode  = action.attr('data-mode');
          if(mode == 'update') {
            action.attr('data-mode', 'edit');
            action.text('EDIT');
            
            // update name
            name.text($(tr).find('.name input').val());
          
            // update city
            city.text($(tr).find('.city input').val());

            // update state
            state.text($('select option:selected').text());
          }
          else {
            action.attr('data-mode', 'update');
            action.text("UPDATE");
            
             //edit name
             var name_val = name.text();  
            var name_input = name.html('<input type="text" value="' + name_val + '" />');

            //edit city
            var city_val = city.text();  
            var city_input = city.html('<input type="text" value="' + city_val + '" />'); 

            //edit state 
            var state_val = state.text();
            var state_html = state.html(
                             '<select>'+
                             '<option value="INVESTOR">INVESTOR</option>'+
                             '<option value="ENTREPRENEUR">ENTREPRENEUR</option>'+
                             '<option value="ANDA MEMBERS">ANDA MEMBERS</option>'+
                             '</select>'
                            );
             $('select option:contains("'+ state_val +'")').prop('selected', true);

          }
        }
      });
    }); 

