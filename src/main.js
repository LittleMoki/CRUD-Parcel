import $ from 'jquery'

$(document).ready(function () {
	// Загружаем продукты при загрузке страницы
	fetchTableData()
})

$('form').on('submit', function (event) {
	event.preventDefault()

	const name = $('input.name').val()
	const cost = $('input.cost').val()

	if (!name || !cost) {
		$('p.error').text(`Пожалуйста, заполните все поля`)

		return
	}

	// POST-запрос для отправки данных
	$.ajax({
		url: 'https://674b96b371933a4e8855a216.mockapi.io/items/getProduct',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ name, cost }),
		success: function () {
			$('form')[0].reset()
			// После успешного отправки данных обновляем таблицу
			fetchTableData()
		},
		error: function (error) {
			console.error('Ошибка отправки данных:', error)
		},
	})
})

// Функция для удаления данных и обновления таблицы
function deleteTableData(id) {
	$.ajax({
		url: `https://674b96b371933a4e8855a216.mockapi.io/items/getProduct/${id}`,
		method: 'DELETE',
		contentType: 'application/json',
		success: function () {
			// После успешного удаления данных, перезагружаем таблицу
			fetchTableData()
			$('p.error').empty()
		},
		error: function (error) {
			console.error('Ошибка при удалении данных:', error)
			$('p.error').text('Ошибка при удалении данных')
		},
	})
}

// Функция для загрузки данных в таблицу
function fetchTableData() {
	$.ajax({
		url: 'https://674b96b371933a4e8855a216.mockapi.io/items/getProduct',
		method: 'GET',
		contentType: 'application/json',
		success: function (response) {
			// Очищаем таблицу перед обновлением данных
			$('table tbody').empty()

			// Добавляем данные в таблицу
			response.forEach(item => {
				const newRow = `
									<tr>
											<td class='border py-3'>${item.id}</td>
											<td class='border py-3'>${item.name}</td>
											<td class='border py-3'>${item.cost}</td>
											<td class='border py-3 delete' data-id="${item.id}">
													<i class="fa-solid fa-trash hover:text-red-500 cursor-pointer"></i>
											</td>
									</tr>
							`
				$('table tbody').append(newRow)
			})

			// Добавляем обработчики кликов для удалений
			$('.delete').on('click', function () {
				const id = $(this).data('id')
				deleteTableData(id)
			})
		},
		error: function (error) {
			console.error('Ошибка при загрузке данных:', error)
			$('p.error').text('Ошибка при загрузке данных')
		},
	})
}
