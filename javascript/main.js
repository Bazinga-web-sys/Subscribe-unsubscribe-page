function generateICS({ title, description, start, end, location }) {
  //standard .ics datoteke, begin i end VEVENT je jedan događaj
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
  link.href = URL.createObjectURL(blob); //vraća privremenu URL adresu koja pokazuje na Blob, koristi se kao href za dowload
  link.download = "appointment.ics";
  document.body.appendChild(link); //dodaj element u dom
  link.click(); //download
  document.body.removeChild(link); //makni element iz DOM-a
}

document.addEventListener("DOMContentLoaded", () => {
  //cekaj na load za DOM

  //dohvati elemente
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const calendarBtns = document.querySelectorAll(".btn.calendar");

  //redirect na confirmed ili canceled pageove
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
  //confirmed page, dodavanje u kalendar
  if (calendarBtns.length > 0) {
    calendarBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        let cal = btn.dataset.cal;
        if (cal === "ios" || cal === "android") {
          generateICS({
            title: "Medical Appointment",
            description: "Your appointment at Affidea Čavka",
            start: "20240816T120000Z",
            end: "20240816T123000Z",
            location: "Jordanovac 99, 10000 Zagreb",
          });
        } else if (cal === "google") {
          window.open(
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Medical+Appointment&dates=20240816T120000Z/20240816T123000Z&details=Your+appointment+at+Affidea+Čavka&location=Jordanovac+99,+10000+Zagreb",
            "_blank"
          );
        } else if (cal === "outlook") {
          // Outlook web link
          window.open(
            "https://outlook.live.com/calendar/0/deeplink/compose?subject=Medical+Appointment&body=Your+appointment+at+Affidea+Čavka&startdt=2024-08-16T12:00:00Z&enddt=2024-08-16T12:30:00Z&location=Jordanovac+99,+10000+Zagreb",
            "_blank"
          );
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
