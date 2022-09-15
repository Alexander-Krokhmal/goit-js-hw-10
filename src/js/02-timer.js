import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    dateTimePicker: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

let selectedDate = null;
refs.startBtn.setAttribute("disabled", true);

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(`Выбранная дата: ${selectedDates[0]}`);
        selectedDate = new Date(selectedDates[0]);
        // console.log(options.defaultDate, selectedDate.getTime());
        timer(selectedDate);
    },
};
flatpickr("input#datetime-picker", options);

// console.log(timer(selectedDate));

function timer(selectedDate) {

    if (selectedDate < options.defaultDate) {
        refs.startBtn.disabled = true;
        Notify.failure("Please choose a date in the future");
        return;
    }

    refs.startBtn.disabled = false;
    refs.startBtn.addEventListener('click', onChooseDate);

    function onChooseDate() {
        refs.startBtn.disabled = true;

        let timerIntervalId = setInterval(() => {
            // const startCount = options.defaultDate.getTime()
            // const endCount = selectedDate.getTime();
            // const dateCountdown = endCount - startCount;
            const dateCountdown = selectedDate - Date.now();
           

            if (dateCountdown < 1000) {
                clearInterval(timerIntervalId);
            };
           const time = convertMs(dateCountdown);

           updateClockface(time);

        }, 1000);
    }
};



 /*
   * - Принимает время в миллисекундах
   * - Высчитывает сколько в них вмещается часов/минут/секунд
   * - Возвращает обьект со свойствами days, hours, mins, secs
   */
 function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = pad(Math.floor(ms / day));
    const hours = pad(Math.floor((ms % day) / hour));
    const minutes = pad(Math.floor(((ms % day) % hour) / minute));
    const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));
  
    return { days, hours, minutes, seconds };
}
  
// console.log(convertMs(2000));
  
//Add '0' before Number if Number < 10
function pad(value) {
    return String(value).padStart(2, '0');
}


function updateClockface({ days, hours, minutes, seconds }) {
    refs.days.textContent = `${days}`;
    refs.hours.textContent = `${hours}`;
    refs.minutes.textContent = `${minutes}`;
    refs.seconds.textContent = `${seconds}`;
}
  
