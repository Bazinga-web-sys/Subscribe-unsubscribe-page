function generateICS({ title, description, start, end, location }) {
  //standard .ics datoteke, begin i end VEVENT je jedan dogaÄ'aj
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title} 
DESCRIPTION:${description}
DTSTART:${start}
DTEND:${end}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a"); //dynamic creation za <a>
  link.href = URL.createObjectURL(blob); //vraÄ‡a privremenu URL adresu koja pokazuje na Blob, koristi se kao href za dowload
  link.download = "appointment.ics";
  document.body.appendChild(link); //dodaj element u dom
  link.click(); //download
  document.body.removeChild(link); //makni element iz DOM-a
}

// Funkcija za detekciju operativnog sustava
function detectOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  }
  
  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  
  return 'Other';
}

// Funkcija za preurediti gumbove kalendara ovisno o OS-u
function reorderCalendarButtons() {
  const os = detectOS();
  
  if (os === 'Android') {
    // Android: Google, Outlook, iCal
    const icalBtn = document.querySelector('[data-cal="ical"]');
    const googleBtn = document.querySelector('[data-cal="google"]');
    const outlookBtn = document.querySelector('[data-cal="outlook"]');
    
    if (icalBtn) icalBtn.style.order = '3';
    if (googleBtn) googleBtn.style.order = '1';
    if (outlookBtn) outlookBtn.style.order = '2';
    
    // Osiguraj da actions kontejner koristi flexbox
    const actionsContainer = document.querySelector('.actions');
    if (actionsContainer) {
      actionsContainer.style.display = 'flex';
      actionsContainer.style.flexDirection = 'column';
    }
  }
  // Za iOS i ostalo ne treba ništa mijenjati jer je već ispravan redoslijed
}

document.addEventListener("DOMContentLoaded", () => {
  //cekaj na load za DOM

  //dohvati elemente
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  //usmjeravanje na confirmed ili canceled pageove
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      window.location.href = "confirmed.html";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "cancelled.html";
    });
  }
  
  // Preuredi gumbove kalendara ovisno o OS-u
  reorderCalendarButtons();
  
  //confirmed page, dodavanje u kalendar
  const calendarBtns = document.querySelectorAll(".btn.calendar");
  if (calendarBtns.length > 0) {
    calendarBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        let cal = btn.dataset.cal;
        if (cal === "ical") {
          generateICS({
            title: "Medical Appointment",
            description: "Your appointment at Affidea ÄŒavka",
            start: "20240816T120000Z",
            end: "20240816T123000Z", //diff of 30minuta
            location: "Jordanovac 99, 10000 Zagreb",
          });
        } else if (cal === "google") {
          window.open(
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Medical+Appointment&dates=20240816T120000Z/20240816T123000Z&details=Your+appointment+at+Affidea+ÄŒavka&location=Jordanovac+99,+10000+Zagreb",
            "_blank"
          );
        } else if (cal === "outlook") {
          // FIX za Outlook: preuzimanje ICS file umjesto deeplink
          generateICS({
            title: "Affieda ÄŒavka",
            description: "Affieda ÄŒavka event",
            start: "20240816T120000Z",
            end: "20240816T123000Z",
            location: "Jordanovac 99, 10000 Zagreb",
          });
        }
        // on-cllick check mark sawp
        const icon = btn.querySelector(".cal-icon");
        if (icon) {
          icon.src = "assets/check.svg";
          icon.alt = "Added";
        }
      });
    });
  }
});
