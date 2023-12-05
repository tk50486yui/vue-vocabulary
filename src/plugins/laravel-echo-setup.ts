import Echo from 'laravel-echo'
import io from 'socket.io-client'
// @ts-expect-error:  necessary
window.io = io
// @ts-expect-error:  necessary
window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001'
})
