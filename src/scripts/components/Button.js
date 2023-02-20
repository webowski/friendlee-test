export default class Button {
	constructor($element) {
		this.$button = $element
		this.$spinner = this.#createSpinner()
		this.$button.addEventListener('click', () => this.#setPending())
	}

	#setPending(callback) {
		this.$button.classList.add('button--pending')
		this.#showSpinner()

		// таймер для демонстрации состояния pending
		setTimeout(() => {
			this.$button.classList.remove('button--pending')
			this.#hideSpinner()
			if (typeof callback === 'function') callback()
		}, 3000)
	}

	#showSpinner() {
		this.$button.appendChild(this.$spinner)
	}

	#hideSpinner() {
		this.$button.querySelector('.button__spinner').remove()
	}

	#createSpinner() {
    const svgNS = 'http://www.w3.org/2000/svg'

		const $spinner = document.createElementNS(svgNS, 'svg')
		$spinner.setAttributeNS(null, 'viewBox', '0 0 42 42')
		$spinner.classList.add('button__spinner')

    var $circle = document.createElementNS(svgNS, 'circle')
		$circle.classList.add('button__spinner-circle')
		$circle.setAttributeNS(null, 'cx', '21')
		$circle.setAttributeNS(null, 'cy', '21')
		$circle.setAttributeNS(null, 'r', '19')
		$circle.setAttributeNS(null, 'fill', 'none')
		$circle.setAttributeNS(null, 'stroke-width', '4')

		$spinner.appendChild($circle)

		return $spinner
	}
}
