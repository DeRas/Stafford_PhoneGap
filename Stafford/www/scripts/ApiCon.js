$(document).ready(function () {
    $('newsError').hide();


    $(document).bind('deviceready', news.onDeviceReady);
    $(document).bind('deviceready', images.onDeviceReady);
    $(document).bind('deviceready', breeders.onDeviceReady);

    $("#nextButton").click(function () {
        currentImagePage = currentImagePage + 1;
        ShowImages(currentImagePage);
    });

    $("#prevButton").click(function () {
        currentImagePage = currentImagePage - 1;
        ShowImages(currentImagePage);
    });

    //$.ajax({
    //    url: "http://staffy.dk/api/images"
    //}).then(function (data){
    //    $('.greeting-id').append(data[0].UrlToImage);
    //});

    //$.ajax({
    //    url: "http://rest-service.guides.spring.io/greeting"
    //}).then(function (data) {
    //    $('.greeting-id').append(data.id);
    //    $('.greeting-content').append(data.content);
    //});

});

function newsTryAgain() {
    // Todo: clear news list
    console.log("Tried to reload news!");
    news.readPosts();
};

var news = {
    posts_url: "http://staffy.dk/api/news",

    onDeviceReady: function () {
        news.readPosts();
    },

    readPosts: function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: news.posts_url,
            success: news.onSuccess,
            error: news.onError
        });

        console.log('Reading news asynchrounously');
    },

    onSuccess: function (data) {
        var list = $(".newslist");
        var nextId = 1;

        $.each(data, function (i, item) {
            var tit = item.Title;
            nextId++;
            var content = "<div data-role='collapsible'><h3>" + item.Title + "</h3><p>" + item.Text + "</p></div>";
            $("#newscollaps").append(content).collapsibleset('refresh');
        });
        $('newsError').hide();
        console.log('News onSuccess');
    },

    onError: function (data, textStatus, errorThrown) {
        $('newsError').show();

        console.log('Data: ' + data);
        console.log('Status: ' + textStatus);
        console.log('Error: ' + errorThrown);
        console.log('News onError');
    }
};


var imagesArray;
var maxPage = 1;
var currentImagePage = 1;

var images = {
    posts_url: "http://staffy.dk/api/images",

    onDeviceReady: function () {
        images.readPosts();
    },

    readPosts: function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: images.posts_url,
            success: images.onSuccess,
            error: images.onError
        });

        console.log('Reading images asynchrounously');
    },

    onSuccess: function (data) {
        imagesArray = data;
        maxPage = Math.ceil(imagesArray.length / 5);

        console.log('Images onSuccess');
    },

    onError: function (data, textStatus, errorThrown) {
        console.log('Data: ' + data);
        console.log('Status: ' + textStatus);
        console.log('Error: ' + errorThrown);
        console.log('Images onError');
    }
};

var imagesShown = false;
$(document).on("pageshow", "#Billeder", function () { // When entering Billeder

    if (!imagesShown) {
        ShowImages(currentImagePage);
    }

});

function ShowImages(pageNumber) {
    var imagesToShow = 10;
    var firstImage = pageNumber * imagesToShow - imagesToShow;
    var lastImage = firstImage + 9;
    
    if(lastImage > imagesArray.length){
        lastImage = imagesArray.length;
    }
    
    var imageslistview = $('#imagesList');

    imageslistview.empty();

    for (var i = firstImage; i < lastImage; i++) {
        imageslistview.append('<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-btn ui-bar-e ui-corner-top">' + imagesArray[i].Title + '</li>');
        imageslistview.append('<li class="custom_listview_img"><img class="imagez" src="' + imagesArray[i].UrlToImage + '"></img></li>');
    }


    
    if (currentImagePage <= 1) {
        $('#prevButton').attr('disabled', true);
    } else {
        $('#prevButton').removeAttr('disabled');
    }

    if (imagesArray.length  / (imagesToShow* currentImagePage) < 1) {
        $('#nextButton').attr('disabled', true);
    } else {
        $('#nextButton').removeAttr('disabled');
    }

    
}


var breeders = {
    posts_url: "http://staffy.dk/api/breeders",

    onDeviceReady: function () {
        breeders.readPosts();
    },

    readPosts: function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: breeders.posts_url,
            success: breeders.onSuccess,
            error: breeders.onError
        });

        console.log('Reading breeders asynchrounously');
    },

    onSuccess: function (data) {
        breedersArray = data;
        console.log('Breeders onSuccess');
    },

    onError: function (data, textStatus, errorThrown) {
        console.log('Data: ' + data);
        console.log('Status: ' + textStatus);
        console.log('Error: ' + errorThrown);
        console.log('Breeders onError');
    }
};

var breedersRetrieved = false;
var breedersArray;
$(document).on("pageshow", "#Breeders", function () { // When entering Billeder

    if (!breedersRetrieved) {
        ShowBreeders(breedersArray);
    }

});

function ShowBreeders(data) {

    data.sort(function (a, b) {
        if (a.KennelName < b.KennelName)
            return -1;
        if (a.KennelName > b.KennelName)
            return 1;
        return 0;
    });

    var flags = [], output = [], l = data.length, i;
    for (i = 0; i < l; i++) {
        if (flags[data[i].Region]) continue;
        flags[data[i].Region] = true;
        output.push(data[i].Region);
    }


    for (o = 0; o < output.length; o++) {
        breederDiv = $('#breedersCollaps');
        breederDiv.append('<div id="' + output[o] + '">');
        breederDiv.append('<h4>' + output[o] + '</h4>');



        for (p = 0; p < data.length; p++) {
            if (data[p].Region == output[o]) {
                currentBreeder = '<div data-role="collapsible">';
                currentBreeder += '<h3>' + data[p].KennelName + '</h3>';
                currentBreeder += '<p>' + data[p].Name + '</p>';
                currentBreeder += '<p>' + data[p].Mail + '</p>';
                currentBreeder += '<p>' + data[p].PhoneNumber + '</p>';
                currentBreeder += '<p>' + data[p].Homepage + '</p>';
                currentBreeder += '</div>';
                $("#breedersCollaps").append(currentBreeder).collapsibleset('refresh');
            }
        }

        breederDiv.append('</div>'); // Main div
    }
}

function startLoadIcon() {
    $.mobile.loading("show", {
        text: "Henter data...",
        textVisible: true,
        theme: "a",
        html: ""
    });
}

function stopLoadIcon() {
    $.mobile.loading("hide");

}