/* timestring to number */
function toNumber(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

class Node {
  constructor(name, start, end, color) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.color = color; // RED or BLACK
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.TNULL = new Node(null, "BLACK"); // Sentinel node for leaves
    this.root = this.TNULL;
  }

  // Rotate left at node x
  leftRotate(x) {
    let y = x.right;
    x.right = y.left;
    if (y.left !== this.TNULL) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  // Rotate right at node x
  rightRotate(x) {
    let y = x.left;
    x.left = y.right;
    if (y.right !== this.TNULL) {
      y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }

  // Balance the tree after insertion
  balanceInsert(node) {
    let current = node;
    while (current.parent && current.parent.color === "RED") {
      if (current.parent === current.parent.parent.left) {
        let uncle = current.parent.parent.right;
        if (uncle && uncle.color === "RED") {
          // Case 1: uncle is red (recolor)
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          // Case 2 or 3: uncle is black (rotate)
          if (current === current.parent.right) {
            current = current.parent;
            this.leftRotate(current); // Left rotation
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.rightRotate(current.parent.parent); // Right rotation
        }
      } else {
        let uncle = current.parent.parent.left;
        if (uncle && uncle.color === "RED") {
          // Mirror Case 1: uncle is red
          current.parent.color = "BLACK";
          uncle.color = "BLACK";
          current.parent.parent.color = "RED";
          current = current.parent.parent;
        } else {
          // Mirror Case 2 or 3: uncle is black
          if (current === current.parent.left) {
            current = current.parent;
            this.rightRotate(current); // Right rotation
          }
          current.parent.color = "BLACK";
          current.parent.parent.color = "RED";
          this.leftRotate(current.parent.parent); // Left rotation
        }
      }
    }
    this.root.color = "BLACK"; // The root must always be black
  }

  // Insert a node
  insert(name, start, end) {
    let newNode = new Node(name, start, end, "RED"); // New nodes are red by default
    newNode.left = this.TNULL;
    newNode.right = this.TNULL;

    let parent = null;
    let current = this.root;

    while (current !== this.TNULL) {
      parent = current;
      if (toNumber(newNode.start) < toNumber(current.start)) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;
    if (parent === null) {
      this.root = newNode; // The tree was empty
    } else if (toNumber(newNode.start) < toNumber(parent.start)) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.balanceInsert(newNode); // Balance the tree
  }

  deleteNode(data) {
    data = toNumber(data);
    this.deleteNodeHelper(this.root, data);
  }

  deleteNodeHelper(node, key) {
    let z = this.TNULL;
    let x, y;

    while (node !== this.TNULL) {
      if (toNumber(node.start) === key) {
        z = node;
      }

      if (toNumber(node.start) <= key) {
        node = node.right;
      } else {
        node = node.left;
      }
    }

    if (z === this.TNULL) {
      console.log("Node not found in the tree");
      return;
    }

    y = z;
    let yOriginalColor = y.color;
    if (z.left === this.TNULL) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === this.TNULL) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }

      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    if (yOriginalColor === "BLACK") {
      this.fixDelete(x);
    }
  }

  transplant(u, v) {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  minimum(node) {
    while (node.left !== this.TNULL) {
      node = node.left;
    }
    return node;
  }

  fixDelete(x) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.leftRotate(x.parent);
          w = x.parent.right;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.right.color === "BLACK") {
            w.left.color = "BLACK";
            w.color = "RED";
            this.rightRotate(w);
            w = x.parent.right;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.right.color = "BLACK";
          this.leftRotate(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w.color === "RED") {
          w.color = "BLACK";
          x.parent.color = "RED";
          this.rightRotate(x.parent);
          w = x.parent.left;
        }

        if (w.left.color === "BLACK" && w.right.color === "BLACK") {
          w.color = "RED";
          x = x.parent;
        } else {
          if (w.left.color === "BLACK") {
            w.right.color = "BLACK";
            w.color = "RED";
            this.leftRotate(w);
            w = x.parent.left;
          }

          w.color = x.parent.color;
          x.parent.color = "BLACK";
          w.left.color = "BLACK";
          this.rightRotate(x.parent);
          x = this.root;
        }
      }
    }
    x.color = "BLACK";
  }

  search(data) {
    let num_data = toNumber(data);
    return this._search(this.root, num_data);
  }

  _search(node, data) {
    if (node === this.TNULL || data === toNumber(node.start)) {
      return node; // Found or reached a NIL node
    }

    if (data < toNumber(node.start)) {
      return this._search(node.left, data); // Search left subtree
    } else {
      return this._search(node.right, data); // Search right subtree
    }
  }

  // Modify a node's details based on its start time
  modify(oldStart, newName, newStart, newEnd) {
    let node = this.search(oldStart);

    if (node === this.TNULL) {
        console.log("Node with start time", oldStart, "not found in the tree.");
        return;
    }

    // Update the node's properties directly
    node.name = newName;

    // Check if the start time has changed
    if (toNumber(oldStart) !== toNumber(newStart)) {
        // Store the old values
        let oldEnd = node.end;

        // Delete the node from the tree
        this.deleteNode(oldStart);
        
        // Insert the updated node with new start and end times
        this.insert(newName, newStart, newEnd);
    } else {
        // If only the name is changed, update the end time as well
        node.end = newEnd; // Update end time if necessary
    }

    console.log("Node modified successfully.");
  }
  // Print the tree (in-order traversal)
  inOrderHelper(node) {
    if (node !== this.TNULL) {
      this.inOrderHelper(node.left);
      console.log(
        "Node:" +
          node.name +
          ", Color:" +
          node.color +
          ", Start Time:" +
          node.start
      );
      this.inOrderHelper(node.right);
    }
  }

  // Public in-order traversal
  inOrderTraversal() {
    this.inOrderHelper(this.root);
  }
}

/* MAIN TREE*/
let tree = new RedBlackTree();
/* MAIN TREE*/

// Function to create a new event element

// Elements
let eventsContainer = document.getElementById("eventsContainer");
let eventDisplayer = document.querySelector(".eventDisplayer");
let addEventBtn = document.getElementById("addEventBtn");
let closeButton = document.querySelector(".closeButton");

// Display elements for the event displayer
let displayNameText = document.getElementById("displayNameText");
let displayStartTimeText = document.getElementById("stDetailText");
let displayEndTimeText = document.getElementById("etDetailText");
let displayVenueText = document.getElementById("vDetailText");
let displayDescText = document.getElementById("descText");

// Input elements for editing
let editNameInput = document.getElementById("editNameInput");
let editStartInput = document.getElementById("editStartInput");
let editEndInput = document.getElementById("editEndInput");
let editVenueInput = document.getElementById("editVenueInput");
let editDescInput = document.getElementById("editDescInput");

// Toggle button
let editBtn = document.getElementById("editBtn");

let isEditMode = false;
let currentEvent = null; // Stores the current event being edited

function createEventElement(
  name = "Event Name",
  startTime = "00:00",
  endTime = "00:00",
  venue = "Location",
  desc = "Event Description!"
) {
  /* TREE ADDED*/
  tree.insert(name, startTime, endTime);
  tree.inOrderTraversal();
  /* TREE ADDED*/

  let newEvent = document.createElement("div");
  let mainEvent = document.createElement("div");
  let deleteEvent = document.createElement("div");
  deleteEvent.classList.add("deleteEvent");
  mainEvent.classList.add("mainEvent");
  newEvent.classList.add("event");

  mainEvent.appendChild(newEvent);
  mainEvent.appendChild(deleteEvent);

  // Set event details
  newEvent.innerHTML = `
    <p class="eventName">${name}</p>
    <div class="schedule">
      <p class="startTime">${startTime}</p>
      <p>-</p>
      <p class="endTime"> ${endTime}</p>
    </div>
    <p class="venue">${venue}</p>
    <p class="desc">${desc}</p>
    `;

  deleteEvent.innerHTML = `
  <svg id="delete" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 16">
    <defs>
        <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/>
    </defs>
    <use fill="#e90404" fill-rule="nonzero" xlink:href="#a"/>
  </svg>
  `;

  deleteEvent.addEventListener("click", () => {
    if (confirm("You want to delete the event") == true) {
      tree.deleteNode(
        deleteEvent.parentNode.childNodes[0].childNodes[3].childNodes[1]
          .innerHTML
      );
      deleteEvent.parentNode.remove();

      tree.inOrderTraversal();
    }
  });

  // Add click event listener to the new event
  newEvent.addEventListener("click", () => {
    handleEventClick(newEvent);
  });

  // Append the new event to the container
  eventsContainer.appendChild(mainEvent);
}

// Close button functionality
closeButton.addEventListener("click", () => {
  eventDisplayer.style.visibility = "hidden";
  isEditMode = false;
  updateViewMode();
});

// Function to switch between view and edit mode
function updateViewMode() {
  if (isEditMode) {
    // Show input fields for editing
    displayNameText.style.display = "none";
    editNameInput.style.display = "inline";
    editNameInput.value = displayNameText.textContent;

    displayStartTimeText.style.display = "none";
    editStartInput.style.display = "inline";
    editStartInput.value = displayStartTimeText.textContent;

    displayEndTimeText.style.display = "none";
    editEndInput.style.display = "inline";
    editEndInput.value = displayEndTimeText.textContent;

    displayVenueText.style.display = "none";
    editVenueInput.style.display = "inline";
    editVenueInput.value = displayVenueText.textContent;

    displayDescText.style.display = "none";
    editDescInput.style.display = "block";
    editDescInput.value = displayDescText.textContent;

    editBtn.textContent = "Save Details";
  } else {
    // View mode
    displayNameText.style.display = "inline";
    editNameInput.style.display = "none";

    displayStartTimeText.style.display = "inline";
    editStartInput.style.display = "none";

    displayEndTimeText.style.display = "inline";
    editEndInput.style.display = "none";

    displayVenueText.style.display = "inline";
    editVenueInput.style.display = "none";

    displayDescText.style.display = "block";
    editDescInput.style.display = "none";

    editBtn.textContent = "Edit Details";
  }
}

// Function to update event details in both the home screen and event displayer
function handleEventClick(eventElement) {
  currentEvent = eventElement;

  let eventName = eventElement.querySelector(".eventName").textContent;
  let startTime = eventElement.querySelector(".startTime").textContent;
  let endTime = eventElement.querySelector(".endTime").textContent;
  let venue = eventElement.querySelector(".venue").textContent;
  let desc = eventElement.querySelector(".desc").textContent;

  // Update the event displayer with clicked event details
  displayNameText.textContent = eventName;
  displayStartTimeText.textContent = startTime;
  displayEndTimeText.textContent = endTime;
  displayVenueText.textContent = venue;
  displayDescText.textContent = desc;

  // Make the event displayer visible
  eventDisplayer.style.visibility = "visible";
  eventDisplayer.style.animationName = "moveLeft";
  eventDisplayer.style.animationDuration = "0.3s";

  isEditMode = false;
  updateViewMode();
}

// Handle adding a new event with default values
addEventBtn.addEventListener("click", () => {
  createEventElement(); // Add a new event with default values

  // Element for search input
  let searchInput = document.getElementById("searchInput");

  function searchEvents() {
    let searchText = searchInput.value.toLowerCase();
    let events = eventsContainer.getElementsByClassName("event");

    Array.from(events).forEach((event) => {
      let eventName = event
        .querySelector(".eventName")
        .textContent.toLowerCase();
      event.parentElement.style.display = eventName.includes(searchText)
        ? ""
        : "none";
    });
  }

  // Initialize with a default event in the RBT
  //tree.insert("Event Name", "00:00", "00:00", "Location", "Event Description!");

  // Add search event listener
  searchInput.addEventListener("input", searchEvents);
});

// Edit functionality
editBtn.addEventListener("click", () => {
  if (isEditMode) {
      // Get the original start time before modification
      let originalStartTime = displayStartTimeText.textContent;
      
      // Get new values from input fields
      let newName = editNameInput.value;
      let newStartTime = editStartInput.value;
      let newEndTime = editEndInput.value;
      let newVenue = editVenueInput.value;
      let newDesc = editDescInput.value;

      // Update the Red-Black Tree
      tree.modify(originalStartTime, newName, newStartTime, newEndTime);

      // Update the display texts
      displayNameText.textContent = newName;
      displayStartTimeText.textContent = newStartTime;
      displayEndTimeText.textContent = newEndTime;
      displayVenueText.textContent = newVenue;
      displayDescText.textContent = newDesc;

      // Update the event in the main container (home screen)
      if (currentEvent) {
          currentEvent.querySelector(".eventName").textContent = newName;
          currentEvent.querySelector(".startTime").textContent = newStartTime;
          currentEvent.querySelector(".endTime").textContent = newEndTime;
          currentEvent.querySelector(".venue").textContent = newVenue;
          currentEvent.querySelector(".desc").textContent = newDesc;
      }

      // Debug: Print tree after modification
      console.log("Tree after modification:");
      tree.inOrderTraversal();
    }

    isEditMode = !isEditMode;
    updateViewMode();
});

// Initialize with a default event when the page loads
createEventElement(
  "Event Name",
  "00:00",
  "00:00",
  "Location",
  "Event Description!"
);

let sharebtn = document.getElementById("shareBtn");
let deleteIcon = document.querySelector(".deleteEvent");
sharebtn.addEventListener("click", () => {
  var opt = {
    margin: 1,
    filename: "Schedule.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // New Promise-based usage:
  deleteIcon.style.display = "none";
  html2pdf().from(eventsContainer).set(opt).save();
});
