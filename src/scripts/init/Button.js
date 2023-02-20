import Button from '../components/Button'

const $buttons = document.querySelectorAll('.button')

$buttons.forEach($button => {
	new Button($button)
})
