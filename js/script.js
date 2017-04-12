"use strict";
$(document).ready(function()
{
    var my_projects = [];
    var featured_projects = [];
    var featured_project_indexes = [1,2,3];
    var home_page_html = "";
    
    var xhr = new XMLHttpRequest();
	xhr.onload = function()
	{
		var myJSON = JSON.parse(xhr.responseText);
		my_projects = myJSON.projects;
        for(var project = 0; project < my_projects.length; project++)
        {
            for(var featured_project = 0; featured_project < featured_project_indexes.length; featured_project++)
            {
                if(project == featured_project_indexes[featured_project])
                {
                    featured_projects.push(my_projects[project]);
                }
            }
        }
        console.log(my_projects);
        console.log(featured_projects);
        var featured_projects_html =  "";
        for(var my_featured_project = 0; my_featured_project < featured_projects.length; my_featured_project++)
    	{
            featured_projects_html += "<div id='featured_project_" + my_featured_project + "'>";
    		featured_projects_html += "<h2 class='project_name'>" + featured_projects[my_featured_project].name + "</h1>";
    		featured_projects_html += "<p class='project_dates'>" + featured_projects[my_featured_project].dates + "</p>";
    		for(var p = 0; p < featured_projects[my_featured_project].description.length; p++)
    		{
    			featured_projects_html += "<p class='content_p'>" + featured_projects[my_featured_project].description[p] + "</p>";
    		}
    		for(var i = 0; i < featured_projects[my_featured_project].imgs.length; i++)
    		{
    			featured_projects_html += "<img class='project_image' src='" + featured_projects[my_featured_project].imgs[i].src + "' " + "alt='" + featured_projects[my_featured_project].imgs[i].alt + "' />";
            }
    		featured_projects_html += "<p class='project_link'><a href='" + featured_projects[my_featured_project].link + "' target='_blank'>" + featured_projects[my_featured_project].link_description + "</a></p>";
    	    featured_projects_html += "<div>";
        }
        document.getElementById("project_div").innerHTML += featured_projects_html;
        home_page_html = document.getElementById("main_div").innerHTML;
	}
	var url = "js/projects.json";
	xhr.open('GET', url, true);
	xhr.setRequestHeader("If-Modified-Since", "Mon, 3 Apr 2017 00:00:00 EST");
	xhr.send();
    
    $("#main_div").on("click", ".more_projects_button", function(e)
	{
        var thumbnail_page_html = "";
        thumbnail_page_html = "<h2 class='content_title'>All Projects</h2>";
        thumbnail_page_html += "<div id='thumbnail_holder'>";
    	thumbnail_page_html += drawAllProjectThumbnails(my_projects);
        thumbnail_page_html += "</div>";
		thumbnail_page_html += "<p id='home_button'><u>Click here to go back to the home page.</u></p>";
        document.getElementById('main_div').innerHTML = thumbnail_page_html;
    });
    $("#main_div").on("click", "#home_button", function(e)
    {
         document.getElementById("main_div").innerHTML = home_page_html;
    });
    $("#main_div").on("click", ".project_thumbnail", function(e)
    {
        //---This opens uop information about a selected project
		var selected_project_html = "";
        var selected_project_index = $(".project_thumbnail").index(this);
        console.log(selected_project_index);
    	selected_project_html += drawSelectedProjectPage(my_projects, selected_project_index)
		selected_project_html += "<p class='more_projects_button'><u>Click here to see all the projects.</u></p>";
		document.getElementById('main_div').innerHTML = selected_project_html;
    });
    
    if ( $(window).width() >= 501)
	{
		var images_in_gallery = [];
        var selected_image;
		var background_images = ["media/inspire_5.jpg", "media/fragileequilibrium_2.png", "media/fragileequilibrium_1.png", "media/globaltemp_1.png"];		
		var background_image_index = 0;
		
		//---On the desktop layout, the background will show random images from the background_images list (with the next images
		//   being shown most likely being the next image in the array
		document.body.style.backgroundImage = "url('" + background_images[background_image_index] + "')";
		setInterval(function()
		{
			var random_number = Math.random();
			if(random_number <= 0.7)
			{
				background_image_index = background_image_index + 1;
			}
			else
			{
				background_image_index = Math.ceil(Math.random()*background_images.length);
			}
			if(background_image_index == background_images.length)
			{
				background_image_index = 0;
			}
			//---Since background imags can't fade in, I used a div to cover the entire background for a moment while the actual image
			//   is being changed.
			$("#background_image_cover").fadeIn(350,function()
			{
				document.body.style.backgroundImage = "url('" + background_images[background_image_index] + "')";
        		$("#background_image_cover").fadeOut(350);
    		});
		}, 7500);
	
		$("#main_div").on("click", ".project_image", function(e)
		{
			//---Clicking on an image sets the HTML for the image gallery, then sets the image gallery to being visible
			var image_gallery_html = "";
		    var pdiv = $(this).parent().attr("id");
            console.log(pdiv);
			$(".project_image").each(function()
            {
                if($(this).parent().attr("id") == pdiv)
                {
                    images_in_gallery.push(this);
                }
            });
			for(var image_src = 0; image_src < images_in_gallery.length; image_src++)
			{
				if(e.target.src == images_in_gallery[image_src].src)
				{
					selected_image = image_src;
				}
			}
            image_gallery_html += "<img id='exit_icon' src='exit_icon.png' />";
			image_gallery_html += "<p id='image_gallery_title'>" + e.target.alt + "</p>";
			image_gallery_html += "<img id='image_holder' src=" + e.target.src + " />";
			image_gallery_html += "<div id='image_gallery_icons'></div";
			document.getElementById("image_gallery").innerHTML = image_gallery_html;
			document.getElementById("image_gallery_icons").innerHTML = drawImageGalleryIcons(images_in_gallery, selected_image);
			document.getElementById("image_gallery").style.display = "block";
			disableScroll();
		});
       $("#image_gallery").on('click', ".image_galley_icon", function(e)
		{
            //---This changes which image is being shown based on the index
            if(e.target.id != "image_galley_icon_selected")
            {
                var selected_image_index = $(".image_galley_icon").index(this);
                document.getElementById("image_gallery_title").innerHTML = images_in_gallery[selected_image_index].alt;
				document.getElementById("image_holder").src = images_in_gallery[selected_image_index].src;
				document.getElementById("image_gallery_icons").innerHTML = drawImageGalleryIcons(images_in_gallery, selected_image_index);
            }
		});
        $("#image_gallery").on("click", "#image_holder", function()
		{
			//---This shows next image in the gallery.
            selected_image++;
            if(selected_image == images_in_gallery.length)
            {
                selected_image = 0;
            }
            document.getElementById("image_gallery_title").innerHTML = images_in_gallery[selected_image].alt;
			document.getElementById("image_holder").src = images_in_gallery[selected_image].src;
			document.getElementById("image_gallery_icons").innerHTML = drawImageGalleryIcons(images_in_gallery, selected_image);
		});
        $("#image_gallery").on("click", "#exit_icon", function()
		{
			//---This closes the gallery
			document.getElementById("image_gallery").style.display = "none";
            document.getElementById("image_gallery").innerHTML = "";
            images_in_gallery = [];
            selected_image = null;
			enableScroll();
		});
	}
    
    else if( $(window).width() < 501)
	{
		var color_list = [ [12, 12, 12],
						  [227, 227, 227],
						  [255, 255, 255],
			              [255, 184, 71],
						  [255, 192, 203],
			         	  [219, 39, 90],
			              [222, 173, 231]];
		var current_gradient = [[0,0,0], [0,0,0]];
		current_gradient[0] = color_list[1].slice();
		current_gradient[1] = color_list[0].slice();
		var color_to_change = 1;
		var target_gradient;
		
		drawGradient(current_gradient[0], current_gradient[1]);
	
		setTimeout(function()
		{
			findTargetGradient(color_list, current_gradient, target_gradient, color_to_change);
		}, 4300);
	}
});

function drawAllProjectThumbnails(all_projects_array)
{
	var all_project_thumbnails_html = "";
	for(var g = 0; g < all_projects_array.length; g++)
	{
        if ( $(window).width() >= 501)
	    {
            var project_thumbnail_margin_left = "";
            var project_thumbnail_margin_right = "";
            if(g%2 == 0)
            {
                if(g == all_projects_array.length -1)
                {
                    project_thumbnail_margin_left = "31%";
                    project_thumbnail_margin_right = "31%";
                }
                else
                {
                    project_thumbnail_margin_left = "8%";
                    project_thumbnail_margin_right = "4%";
                }
            }
            else
            {
                project_thumbnail_margin_left = "4%";
                project_thumbnail_margin_right = "8%";
            }
            all_project_thumbnails_html += "<div class='project_thumbnail' id=" + g + " style='margin-left:" + project_thumbnail_margin_left + ";margin-right: " + project_thumbnail_margin_right + "'>";
        }
        else
        {
            all_project_thumbnails_html += "<div class='project_thumbnail'>";
        }
        all_project_thumbnails_html += "<div class='project_thumbnail_info'>";
        all_project_thumbnails_html += "<p class='project_thumbnail_name'>" + all_projects_array[g].name + "</p>";
        all_project_thumbnails_html += "<p class='project_thumbnail_daterange'>" + all_projects_array[g].dates + "</p>";
        all_project_thumbnails_html += "</div>";
        all_project_thumbnails_html += "<div class='project_thumbnail_background_image' style='background-image:url(" + all_projects_array[g].imgs[0].src + ")' >";
        all_project_thumbnails_html += "</div>";
        all_project_thumbnails_html += "<p class='project_thumbnail_languages'>" + all_projects_array[g].languages + "</p>";
        all_project_thumbnails_html += "</div>";
	}
	return all_project_thumbnails_html;
}
function drawSelectedProjectPage(all_projects_array, selected_project)
{
    var selected_project_html = "";
    selected_project_html += "<h2 class='project_name project_page_name'>" + all_projects_array[selected_project].name + "</h1>";
    selected_project_html += "<p class='project_dates'>" + all_projects_array[selected_project].dates + "</p>";
    for(var p = 0; p < all_projects_array[selected_project].description.length; p++)
    {
     	selected_project_html += "<p class='content_p'>" + all_projects_array[selected_project].description[p] + "</p>";
  	}
  	for(var i = 0; i < all_projects_array[selected_project].imgs.length; i++)
  	{
 	     selected_project_html += "<img class='project_image' src='" + all_projects_array[selected_project].imgs[i].src + "' " + "alt='" + all_projects_array[selected_project].imgs[i].alt + "' />";
    }
    if(all_projects_array[selected_project].link)
    {
        //---Unfortunately, I don't currently have constant proper access to Github so I dont have the ability to have links to all my work.
        selected_project_html += "<p class='project_link'><a href='" + all_projects_array[selected_project].link + "' target='_blank'>" + all_projects_array[selected_project].link_description + "</a></p>";
    }
    return selected_project_html;
}

//-----Functions for image gallery on desktop layout-----//
function drawImageGalleryIcons(set_images, selected_image)
{
	var image_gallery_icons_html = "";
	for(var x = 0; x < set_images.length; x++)
	{
		if(x == selected_image)
		{
			image_gallery_icons_html += "<div class='image_galley_icon' id='image_galley_icon_selected'></div>";
		}
		else
		{
			image_gallery_icons_html += "<div class='image_galley_icon'></div>";
		}
	}
	return image_gallery_icons_html;
}

//---functions to stop scrolling when image gallery is up
//---Key Codes: left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};
function preventDefault(e)
{
  e = e || window.event;
  if (e.preventDefault)
  {
      e.preventDefault();
  }
  e.returnValue = false;  
}
function preventDefaultForScrollKeys(e)
{
    if (keys[e.keyCode])
	{
        preventDefault(e);
        return false;
    }
}
function disableScroll()
{
	if (window.addEventListener) // older FF
	{
	  window.addEventListener("DOMMouseScroll", preventDefault, false);
	}  
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	document.onkeydown  = preventDefaultForScrollKeys;
}
function enableScroll()
{
    if (window.removeEventListener)
	{
        window.removeEventListener("DOMMouseScroll", preventDefault, false);
	}
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    document.onkeydown = null;  
}

//-----Functions for gradient changes on mobile layout-----//
function drawGradient(topColor, bottomColor)
{
	//---this ensures that the gradient will be seen across multiple browsers
	var prefixes = ['-o-','-ms-','-moz-','-webkit-',''];
	for(var x = 0; x < prefixes.length; x++)
	{
		document.body.style.background = prefixes[x] + 'linear-gradient(rgb(' + topColor[0] + ',' + topColor[1] + ',' + topColor[2] + '),' + 'rgb(' + bottomColor[0] + ',' + bottomColor[1] + ',' + bottomColor[2] + '))';
	}
}

function findTargetGradient(all_colors, current_grad, target_grad, changeing_index)
{
	//---The first step in setting the gradient is to find the current colors and then find which color is next on the list.
	//---The "target gradient" keeps one of the colors of the current gradient.
	var target_index;
	var current_grad_top_color;
	var current_grad_bottom_color;
	target_grad = current_grad.slice();
	for(var cc = 0; cc < all_colors.length; cc++)
	{
		if((current_grad[0][0] == all_colors[cc][0]) && (current_grad[0][1] == all_colors[cc][1]) && (current_grad[0][2] == all_colors[cc][2]))
		{
			current_grad_top_color = cc;
		}
		if((current_grad[1][0] == all_colors[cc][0]) && (current_grad[1][1] == all_colors[cc][1]) && (current_grad[1][2] == all_colors[cc][2]))
		{
			current_grad_bottom_color = cc;
		}
	}
	target_index = (Math.max(current_grad_top_color,current_grad_bottom_color)+1);
	
	if(target_index == all_colors.length)
	{
		target_index = 0;
	}
	if(target_index == current_grad_top_color || target_index == current_grad_bottom_color)
	{
		target_index = target_index + 1;
	}
	
	target_grad[changeing_index] = '';
	target_grad[changeing_index] = all_colors[target_index].slice();
	findColorDifference(all_colors, current_grad, target_grad, changeing_index);
}
function findColorDifference(all_colors, current_grad, target_grad, changeing_index)
{
	//---The second step in setting the gradient is to find the difference between the current gradient and the target gradient
	var difference = [];
	for(var x = 0; x < current_grad[changeing_index].length; x++)
	{
		difference.push(current_grad[changeing_index][x] - target_grad[changeing_index][x]);
	}
	updateGradient(all_colors, current_grad, target_grad, changeing_index, difference);
}
function updateGradient(all_colors, current_grad, target_grad, changeing_index, diff)
{
	//---Here is where the gradient is actually changed based on a timed interval.
	var change_time = 180;
	var elapsed_time = 0;
	var drawUpdatedGradient = setInterval(function()
	{
		elapsed_time++;
		for(var x = 0; x < current_grad[changeing_index].length; x++)
		{
			if((diff[x] < 0) && (current_grad[changeing_index][x] != target_grad[changeing_index][x]))
			{
				if(elapsed_time%Math.ceil(change_time/(diff[x]*-1)) == 0)
				{
					current_grad[changeing_index][x] = current_grad[changeing_index][x] + 1;
					if(current_grad[changeing_index][x] > target_grad[changeing_index][x])
					{
						current_grad[changeing_index][x] = target_grad[changeing_index][x];
					}
										
				}
			}
			else if((diff[x] > 0) && (current_grad[changeing_index][x] != target_grad[changeing_index][x]))
			{
				if(elapsed_time%Math.ceil(change_time/diff[x]) == 0)
				{
					current_grad[changeing_index][x] = current_grad[changeing_index][x] - 1;
					if(current_grad[changeing_index][x] < target_grad[changeing_index][x])
					{
						current_grad[changeing_index][x] = target_grad[changeing_index][x];
					}
				}
			}
		}
		if((target_grad[changeing_index][0] == current_grad[changeing_index][0]) && (target_grad[changeing_index][1] == current_grad[changeing_index][1]) && (target_grad[changeing_index][2] == current_grad[changeing_index][2]))
		{
			//---When the target has been reached, reset everything.
			reset(all_colors, current_grad, target_grad, changeing_index, drawUpdatedGradient);
		}
		drawGradient(current_grad[0], current_grad[1]);
	}, 50);
}
function reset(all_colors, current_grad, target_grad, changeing_index, updater)
{
	//---The final step is reset everything and switch which color in the gradient is going to be changed next.
	clearInterval(updater);
	if(changeing_index == 0)
	{
		changeing_index = 1;
	}
	else if(changeing_index == 1)
	{
		changeing_index = 0;
	}
	target_grad = "";
	setTimeout(function()
	{	
		//---Before restarting the whole process, let's revel in the colors for just a moment.
		findTargetGradient(all_colors, current_grad, target_grad, changeing_index);
	}, 2000);
}