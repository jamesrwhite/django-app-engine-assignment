// Code reliant on jQuery and the DOM being ready
$(document).ready(function() {

	// TinyMCE Setup and Configuration
	tinymce.init({
		selector: 'textarea',
		menubar: false, // Hide the menu bar
		statusbar: false, // Hide the status bar
		plugins: ['link'],
		height: 750,
		verify_html: false,
		toolbar: 'undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | selectmedia',
		extended_valid_elements: '*[*]',
		relative_urls :false, // Stop TinyMCE messing up our urls!
		setup: function(editor) {
			editor.addButton('selectmedia', {
				text: 'Select Media',
				icon: false,
				onclick: function() {
					editor.windowManager.open({
						title: 'Media Search',
						file: '/cms/media/search/tinymce?title=' + $('#id_title').val(),
						width: 320,
						height: 240
					});
				}
			});
		}
	});
	// End TinyMCE

	// Init the select2 jQuery plugin
	$('select').select2({width: 'resolve'});

	// Handle the AJAX based search widget used by the TinyMCE editor
	function searchMedia(query) {

		var $results = $('#media-search-results');
		var results_html;

		// Ensure we actually have something to search for
		if (typeof query != 'undefined' && query.length > 0) {

			// Submit the AJAX requset, but not asynchornously to make this
			// a bit simpler. Also ensure the browser doesn't cache the response
			// by appending a random query string to the request
			$.ajax({
				url: '/api/search?doc_type=media&query=' + query,
				cache: false,
				async: false
			}).done(function(results) {

				var result;
				var glyph;
				var content;
				results_html = '';

				// Loop through our result set
				for (var id in results.data) {

					content = '';
					result = results.data[id];

					// Based on the content type append an appropriate icon and
					// the source of the media element
					if (result.type === 'image') {

						glyph = 'camera';
						content += '<img src="' + result.content + '"/>';

					} else if (result.type === 'audio') {

						glyph = 'volume-up';
						content += '<audio controls>';
						// As this is just a prototype only mp3 audio files are supported
						content += '<source src="' + result.content + '" type="audio/mpeg">';
						content += 'Your browser does not support HTML5 audio.</audio>';

					} else if (result.type === 'video') {

						glyph = 'film';
						content += '<video controls>';
						// As this is just a prototype only mp4 video files are supported
						content += '<source src="' + result.content + '" type="video/mp4">';
						content += 'Your browser does not support HTML5 video.</video>';

					} else if (result.type === 'text') {

						glyph = 'font';

					}

					// Append the HTML used to create the list to display to the user
					results_html += '<li><span class="glyphicon glyphicon-' + glyph + '"></span> ';
					results_html += '<a data-content="' + encodeURIComponent(content) + '" ';
					results_html += 'href="javascript:void(0)">' + result.title + '</a></li>';

				}

			});

			$results.html(results_html);

		} else {

			$results.html('');

		}

	}

	// Cache the media search ui selector for performance
	$media_search_ui = $('#media-search-ui');

	// Search media on keyup
	$media_search_ui.on('keyup', function(e) {

		searchMedia($(this).val());

	});

	// Run a search initially with the page title
	searchMedia($media_search_ui.val());

	// Handle the pop up box used by the TinyMCE editor
	$('#media-search-results').on('click', 'li a', function(e) {

		// URL Decode and insert the content into the active editor window
		window.top.tinymce.EditorManager.activeEditor.insertContent(decodeURIComponent($(this).data('content')));

		// Close our pop up
		window.top.tinymce.activeEditor.windowManager.close();

	});

	// Function used to handle which (if any) of the optional media fields should be shown
	function handleMediaOptionalFields(value) {

		// If audio, video or image was selected then show the file field and hide the content field
		if (value === 'audio' || value === 'video' || value === 'image') {

			$('.form-file').show();
			$('.form-content').hide();

		// If text was selected then show the content field and hide the file field
		} else if (value === 'text') {

			$('.form-file').hide();
			$('.form-content').show();

		// If neither were selected then make sure both are hidden
		} else {

			$('.form-file, .form-content').hide();

		}

	}

	// Handle changing of the value of the type select box on the media forms
	$id_type = $('form #id_type');
	$id_type.on('change', function(e) {

		handleMediaOptionalFields($(this).val());

	});

	// A bit of a hacky way unfortunately of handling when Django returns validation errors
	// and the need to display either the content or file field
	if ($id_type.length > 0) {

		handleMediaOptionalFields($id_type.val());

	}

});
// End jQuery reliant code