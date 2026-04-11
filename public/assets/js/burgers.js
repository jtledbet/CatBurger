// Wait for DOM to fully load before attaching handlers
$(function() {

  // Toggle devoured / undevoured
  $(".change-devour").on("click", function() {
    var id        = $(this).data("id");
    var newDevour = $(this).data("newdevour");

    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: { devoured: !newDevour }
    }).then(function() {
      location.reload();
    }).fail(function(jqXHR) {
      alert("Couldn't update burger (status " + jqXHR.status + "). Try again.");
    });
  });

  // Create a new burger
  $(".create-form").on("submit", function(event) {
    event.preventDefault();

    var name = $("#catburga").val().trim();
    if (!name) {
      alert("Please enter a burger name!");
      return;
    }

    $.ajax("/api/burgers", {
      type: "POST",
      data: { name: name, devoured: 0 }
    }).then(function() {
      location.reload();
    }).fail(function(jqXHR) {
      alert("Couldn't create burger (status " + jqXHR.status + "). Try again.");
    });
  });

  // Delete a burger
  $(".delete-burger").on("click", function() {
    var id = $(this).data("id");

    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(function() {
      location.reload();
    }).fail(function(jqXHR) {
      alert("Couldn't delete burger (status " + jqXHR.status + "). Try again.");
    });
  });

});
