function attachSubObserver(targetNode) {
	// Options for the observer (which mutations to observe)
	let config = { attributes: true };

	// Callback function to execute when mutations are observed
	let callback = function(mutationsList) {
		if (!targetNode.hasChildNodes())
			return;

		let container = targetNode.children[0];

		if (!container.hasChildNodes())
			return;		

		for (child of container.children) {
			child.innerHTML = child.innerHTML.replace(/\[.*\]/g, '') 
		}    
	};

	// Create an observer instance linked to the callback function
	let observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	console.log("Netflix CC destroyer is waiting on", targetNode, " for closed captions to destroy");
}

let docObserverConfig = {
	childList: true,
	subtree: true
};

// Create observer 
new MutationObserver(function (mutations, me) {
	let subsContainer = document.getElementsByClassName("player-timedtext")[0];

	if (subsContainer) {
		console.log("Found subs container!");

		attachSubObserver(subsContainer);

		// No longer to need to observe the document.
		me.disconnect();
		return;
	}
}).observe(document, docObserverConfig);
