//Function to retrieve or create an entry array
var getEntries = function() {
    entriesObject = JSON.parse(localStorage.getItem('entriesObject'));
    if (!entriesObject) {
        entriesObject = {};
        for (i=9; i<18; i++) {
            entriesObject[i] = '';
        }
    };
    return(entriesObject);
}

//Function to read entries off the page
var readEntries = function() {
    entriesObject = {};
    $('.time-block').each(function() {
        var timeIndex = $(this).attr('data-timeIndex');
        entriesObject[timeIndex] = $('#entry'+timeIndex).text();
    });
    return(entriesObject)
}

/*Function to set the time class of an element based on its
relation to the current time.*/
var setTimeClass = function(element, timeIndex) {
    element.removeClass('past present future');

    var time = moment().set("hour", timeIndex);
    var timeDifference = moment().diff(time, "hours");
    
    if (timeDifference === 0) {
        element.addClass("present");
    }
    else if (timeDifference < 0) {
        element.addClass("future");
    }
    else if (timeDifference > 0) {
        element.addClass("past");
    }
}

//Function to create the day planner
var createCalendar = function() {
    var entriesObject = getEntries();

    var hourList = $('<ul>');
    hourList.attr('id', 'hour-list-ul');
    $('.container').append(hourList);

    for (i=9; i<18; i++) {
        if (i < 12) {
            var hour = i;
            var AMPM = 'AM';
        }
        else if (i === 12) {
            var hour = i;
            var AMPM = 'PM';
        }
        else {
            var hour = i-12;
            var AMPM = 'PM';
        }

        var item = $('<li>');
        item.addClass('time-block');
        item.addClass('row');
        item.attr('data-timeIndex', i);
        hourList.append(item);

        var hourDisplay = $('<p>');
        hourDisplay.addClass('hour');
        hourDisplay.text(hour + AMPM);
        hourDisplay.attr('id', 'hour'+i);
        hourDisplay.attr('data-timeIndex', i);
        item.append(hourDisplay);

        var entry = $('<p>');
        entry.addClass('entry-display');
        entry.text(entriesObject[i]);
        entry.attr('id', 'entry'+i);
        entry.attr('data-timeIndex', i);
        item.append(entry);

        var button = $('<button>');
        button.addClass('saveBtn');
        button.addClass('oi oi-calendar');
        button.attr('id', 'button'+i);
        button.attr('data-timeIndex', i);
        item.append(button);

        setTimeClass(entry, i)
    }
}

//Initialize content and requisite variables
$('#currentDay').text(moment().format('dddd, MMMM Do'));
createCalendar();

//Function to add event listener to entry elements
var addClickEntry = function() {
    $('.entry-display').on("click", function() {
        var timeIndex = $(this).attr('data-timeIndex');
        var text = $('#entry'+timeIndex).text();
        var textInput = $("<textarea>")
            .attr('id', 'text'+timeIndex)
            .addClass("form-control")
            .val(text);
        setTimeClass(textInput, timeIndex);
        $(this).replaceWith(textInput);
        addSaveEntry();
    })
}

//Function to add click listener to save button
var addSaveEntry = function() {
    $(".saveBtn").on("click", function() {
        var timeIndex = $(this).attr('data-timeIndex');
        var text = $('#text'+timeIndex).val();
        localStorage.setItem('entriesObject', JSON.stringify(entriesObject));
        var entry = $('<p>');
        entry.addClass('entry-display');
        entry.text(text);
        entry.attr('id', 'entry'+timeIndex);
        entry.attr('data-timeIndex', timeIndex);

        setTimeClass(entry, timeIndex);
        $('#text'+timeIndex).replaceWith(entry);

        var entriesObject = readEntries();
        localStorage.setItem('entriesObject', JSON.stringify(entriesObject));

        addClickEntry();
      });
}

//Add entry click listeners
addClickEntry();
