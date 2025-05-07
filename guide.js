const times = [
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

const channels = [
  "HBO", "Cinemax", "Showtime", "Starz",
  "AMC", "TNT", "ESPN", "BBC America"
];

const sampleTitles = [
  "Quantum Leap", "Matlock", "Family Matters", "Night Court", "MacGyver", "Cheers",
  "Twin Peaks", "The A-Team", "Murder, She Wrote", "Knight Rider", "Hill Street Blues",
  "The Wonder Years", "Unsolved Mysteries", "America's Funniest Home Videos",
  "Baywatch", "The Fresh Prince"
];

const shows = channels.map((channel, i) => {
  const channelShows = [];
  for (let j = 0; j < times.length;) {
    const startTime = times[j];
    const randomTitle = sampleTitles[(i * 2 + j) % sampleTitles.length];
    const isHourLong = Math.random() < 0.25 && j < times.length - 1;
    channelShows.push({
      title: randomTitle,
      start: startTime,
      length: isHourLong ? 2 : 1
    });
    j += isHourLong ? 2 : 1;
  }
  return channelShows;
});

let scrollX = 0;
let scrollY = 0;
let selectedRow = 0;
let selectedCol = 0;

const guide = document.getElementById("guide");
const titleInfo = document.getElementById("show-title");
const timeInfo = document.getElementById("show-time");

function renderGuide() {
  guide.innerHTML = "";

  const header = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const empty = document.createElement("th");
  headerRow.appendChild(empty);

  for (let i = 0; i < 4; i++) {
    const th = document.createElement("th");
    th.textContent = times[scrollX + i];
    headerRow.appendChild(th);
  }
  header.appendChild(headerRow);
  guide.appendChild(header);

  const tbody = document.createElement("tbody");

  for (let row = 0; row < 4; row++) {
    const tr = document.createElement("tr");
    const channelCell = document.createElement("td");
    channelCell.className = "channel";
    channelCell.textContent = channels[scrollY + row];
    tr.appendChild(channelCell);

    const currentShows = shows[scrollY + row];
    let col = 0;
    while (col < 4) {
      const time = times[scrollX + col];
      const td = document.createElement("td");
      const show = currentShows.find(s => s.start === time);

      if (show) {
        td.textContent = show.title;
        if (show.length > 1) td.colSpan = show.length;
        if (
          row === selectedRow && col === selectedCol
        ) {
          td.classList.add("selected");
          titleInfo.textContent = `Title: ${show.title}`;
          timeInfo.textContent = `Time: ${show.start}`;
        }
      }

      tr.appendChild(td);
      col += show ? show.length : 1;
    }

    tbody.appendChild(tr);
  }
  guide.appendChild(tbody);
}

function moveSelection(dx, dy) {
  let newRow = selectedRow + dy;
  let newCol = selectedCol + dx;
  if (newCol < 0 || newCol > 3 || newRow < 0 || newRow > 3) return;

  const targetTime = times[scrollX + newCol];
  const currentChannel = shows[scrollY + newRow];

  const targetShow = currentChannel.find(show => {
    const startIndex = times.indexOf(show.start);
    return startIndex >= 0 && scrollX + newCol >= startIndex && scrollX + newCol < startIndex + show.length;
  });

  if (!targetShow) {
    const fallbackShow = currentChannel.find(show => {
      const startIndex = times.indexOf(show.start);
      return startIndex >= 0 && scrollX + selectedCol >= startIndex && scrollX + selectedCol < startIndex + show.length;
    });
    if (fallbackShow) {
      selectedRow = newRow;
      selectedCol = times.indexOf(fallbackShow.start) - scrollX;
      renderGuide();
    }
    return;
  }

  selectedRow = newRow;
  selectedCol = times.indexOf(targetShow.start) - scrollX;
  renderGuide();
}

function scrollGuide(dx, dy) {
  scrollX = Math.max(0, Math.min(times.length - 4, scrollX + dx));
  scrollY = Math.max(0, Math.min(channels.length - 4, scrollY + dy));
  renderGuide();
}

function play() {
  const currentShow = shows[scrollY + selectedRow].find(s => s.start === times[scrollX + selectedCol]);
  if (currentShow) alert(`Now playing: ${currentShow.title}`);
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (selectedRow === 0 && scrollY > 0) scrollGuide(0, -1);
      else moveSelection(0, -1);
      break;
    case "ArrowDown":
      if (selectedRow === 3 && scrollY < channels.length - 4) scrollGuide(0, 1);
      else moveSelection(0, 1);
      break;
    case "ArrowLeft":
      if (selectedCol === 0 && scrollX > 0) scrollGuide(-1, 0);
      else moveSelection(-1, 0);
      break;
    case "ArrowRight":
      if (selectedCol === 3 && scrollX < times.length - 4) scrollGuide(1, 0);
      else moveSelection(1, 0);
      break;
    case "Enter": play(); break;
  }
});

renderGuide();