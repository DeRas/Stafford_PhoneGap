$(document).ready(function () {




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

var newsRetrieved = false;

$(document).on("pageshow", "#Home", function () { // When entering pagetwo

    //$("#newscollaps") = colla;
    //$.each(colla, function (i, item) {
    //    colla.remove(item);
    //});
    if (!newsRetrieved) {


        var nextId = 1;
        $.ajax({
            url: "http://staffy.dk/api/news"
        }).then(function (data) {
            var list = $(".newslist");


            $.each(data, function (i, item) {
                var tit = item.Title;
                nextId++;
                var content = "<div data-role='collapsible'><h3>" + item.Title + "</h3><p>" + item.Text + "</p></div>";
                $("#newscollaps").append(content).collapsibleset('refresh');

            });
        });

        newsRetrieved = true;
    }

});

// Bind to the navigate event
$(window).on("navigate", function () {
    console.log("navigated!");
});

$(".selector").on("pagecontainerchange", function (event, ui) { alert("LAWL") });

//$(function () {
//    $("#penis").load("Test.html");
//});

var imagesRetrieved = false;
var imagesArray;
var maxPage = 1;

$(document).on("pageshow", "#Billeder", function () { // When entering Billeder

    if (!imagesRetrieved) {
        $.ajax({
            url: "http://staffy.dk/api/images"
        }).then(function (data) {
            imagesArray = data;

            imagesRetrieved = true;
            maxPage = Math.ceil(imagesArray.length / 5);

            ShowImages(1);

        });

    }

});

function ShowImages(pageNumber) {
    var firstImage = pageNumber * 5 - 5;
    var lastImage = firstImage + 4;
    
    if(lastImage > imagesArray.length){
        lastImage = imagesArray.length;
    }
    
    for (var i = firstImage; i <= lastImage; i++) {
        $('#imagesDiv').append(' <img src="' + imagesArray[i].UrlToImage + '" alt="A staff!"> ');
    }
}