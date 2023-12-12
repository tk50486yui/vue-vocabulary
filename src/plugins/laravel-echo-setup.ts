import Echo from 'laravel-echo'
// @ts-expect-error:  necessary
import io from 'socket.io-client'
// @ts-expect-error:  necessary
window.io = io
// @ts-expect-error:  necessary
window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: import.meta.env.VITE_ECHO_HOST_AND_PORT
})
