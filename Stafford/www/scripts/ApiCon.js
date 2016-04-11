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


});

var baseApi = "http://sbtdk.azurewebsites.net/api/";
var baseImageUrl = "https://sbtdk.blob.core.windows.net/staffimages/";

function newsTryAgain() {
    // Todo: clear news list
    console.log("Tried to reload news!");
    news.readPosts();
};

var news = {
    posts_url: baseApi + "getnews",

    onDeviceReady: function () {
        startLoadIcon();
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
        data.sort(function (a, b) {
            if (a.Id < b.Id)
                return 1;
            if (a.Id > b.Id)
                return -1;
            return 0;
        });

        var list = $(".newslist");
        var nextId = 1;

        $.each(data, function (i, item) {
            var tit = item.Title;
            nextId++;
            var content = "<div data-role='collapsible'><h3>" + item.Title + "</h3><p><img class='imagez' src='" + baseImageUrl + item.ImageUrl + "'></img></p><p>" + item.Text + "</p><p><a href='" + item.Link + "'>" + item.Link + "</a></p></div>";
            $("#newscollaps").append(content).collapsibleset('refresh');
        });
        $('newsError').hide();
        stopLoadIcon();
        console.log('News onSuccess');
    },

    onError: function (data, textStatus, errorThrown) {
        $('newsError').show();
        stopLoadIcon();
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
    
    posts_url: baseApi + "getimages",

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
        startLoadIcon();
        ShowImages(currentImagePage);
        stopLoadIcon();
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
        imageslistview.append('<li class="custom_listview_img"><img class="imagez" src="' + baseImageUrl + imagesArray[i].UrlToImage + '"></img></li>');
    }

    $(".custom_listview_img").on("click", function () {
        // Do stuff, get id of image perhaps?
        link = $(this).children('img').attr('src');
        $('#popupImage').attr('src', link);
        $('#popupImageLink').click();
    });
    
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
    posts_url: baseApi + "getbreeders",

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

var breedersShown = false;
var breedersArray;
$(document).on("pageshow", "#Breeders", function () { // When entering Billeder

    if (!breedersShown) {
        startLoadIcon();
        ShowBreeders(breedersArray);
        breedersShown = true;
        stopLoadIcon();
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

    output.sort(function (a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });

    for (o = 0; o < output.length; o++) {
        breederDiv = $('#breedersCollaps');
        breederDiv.append('<div id="' + output[o] + '">');
        breederDiv.append('<h4>' + output[o] + '</h4>');



        for (p = 0; p < data.length; p++) {
            if (data[p].Region == output[o]) {
                currentBreeder = '<div data-role="collapsible">';
                currentBreeder += '<h3>' + data[p].KennelName + '</h3>';

                if(data[p].Name != null)
                    currentBreeder += '<p>' + data[p].Name + '</p>';

                if (data[p].Mail != null)
                    currentBreeder += '<p>' + data[p].Mail + '</p>';

                if (data[p].PhoneNumber != null)
                    currentBreeder += '<p>' + data[p].PhoneNumber + '</p>';

                if (data[p].Homepage != null)
                    currentBreeder += '<p><a href="' + data[p].Homepage + '">' + data[p].Homepage + '</a></p>';

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