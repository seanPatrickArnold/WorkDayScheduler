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
    // apply new class if task is near/over due date
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

var createCalendar = function(calendarObject) {
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

        calendarObject[hour+AMPM+'Index'] = i;

        calendarObject[hour+AMPM+'item'] = $('<li>');
        var item = calendarObject[hour+AMPM+'item'];
        item.addClass('time-block');
        item.addClass('row');
        item.attr('data-timeIndex', i);
        hourList.append(item);

        calendarObject[hour+AMPM+'hourDisplay'] = $('<p>');
        var hourDisplay = calendarObject[hour+AMPM+'hourDisplay'];
        hourDisplay.addClass('hour');
        hourDisplay.text(hour + AMPM);
        hourDisplay.attr('id', 'hour'+i);
        hourDisplay.attr('data-timeIndex', i);
        item.append(hourDisplay);

        calendarObject[hour+AMPM+'entry'] = $('<p>');
        var entry = calendarObject[hour+AMPM+'entry'];
        entry.addClass('entry-display');
        entry.text(entriesObject[i]);
        entry.attr('id', 'entry'+i);
        entry.attr('data-timeIndex', i);
        item.append(entry);

        calendarObject[hour+AMPM+'icon'] = $('<button>');
        var icon = calendarObject[hour+AMPM+'icon'];
        icon.addClass('saveBtn');
        icon.addClass('oi oi-calendar');
        icon.attr('id', 'button'+i);
        icon.attr('data-timeIndex', i);
        item.append(icon);

        setTimeClass(entry, i)
    }
}

var entriesArray = getEntries();
var calendarObject = {}

$('#currentDay').text(moment().format('dddd, MMMM Do'));
createCalendar(calendarObject, entriesArray);

var addClickEntry = function() {
    $('.entry-display').on("click", function() {
        // get current text of p element
        var timeIndex = $(this).attr('data-timeIndex');
        var text = $('#entry'+timeIndex).text();

        // replace p element with a new textarea
        var textInput = $("<textarea>")
            .attr('id', 'text'+timeIndex)
            .addClass("form-control")
            .val(text);
        setTimeClass(textInput, timeIndex);
        $(this).replaceWith(textInput);
        addSaveEntry();
    })
}

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

addClickEntry();
