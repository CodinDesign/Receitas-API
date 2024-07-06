// Adiciona um listener para o evento de submit do formulário
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Previne o comportamento padrão de submit do formulário

  // Obtém o valor do campo de entrada (nome da receita) e remove espaços em branco extras
  const recipeName = document.getElementById('recipe-name').value.trim();

  // Verifica se o campo de entrada está vazio
  if (!recipeName) {
    alert('Por favor, digite o nome da receita.'); // Exibe um alerta se o campo estiver vazio
    return; // Interrompe a execução da função
  }

  // Cria o endpoint da API com o nome da receita codificado
  const endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipeName)}`;

  // Faz uma requisição fetch para o endpoint da API
  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar receitas'); // Lança um erro se a resposta não estiver OK
      }
      return response.json(); // Converte a resposta para JSON
    })
    .then(data => {
      displayResults(data.meals); // Chama a função para exibir os resultados
    })
    .catch(error => {
      console.error('Erro ao buscar receitas:', error); // Exibe um erro no console se houver problemas na requisição
      alert('Desculpe, houve um erro ao buscar as receitas. Por favor, tente novamente mais tarde.'); // Exibe um alerta ao usuário sobre o erro
    });
});

// Função para exibir os resultados das receitas
function displayResults(recipes) {
  const resultsContainer = document.getElementById('results'); // Obtém o contêiner de resultados pelo ID
  resultsContainer.innerHTML = ''; // Limpa qualquer conteúdo existente no contêiner

  // Verifica se não há receitas retornadas ou se o array de receitas está vazio
  if (!recipes || recipes.length === 0) {
    resultsContainer.innerHTML = '<p>Nenhuma receita encontrada com esse nome.</p>'; // Exibe uma mensagem se não houver receitas encontradas
    return; // Interrompe a execução da função
  }

  const ul = document.createElement('ul'); // Cria uma lista não ordenada para exibir as receitas
  ul.classList.add('recipe-list'); // Adiciona uma classe à lista criada

  // Itera sobre cada receita retornada
  recipes.forEach(recipe => {
    const li = document.createElement('li'); // Cria um item de lista para cada receita
    li.innerHTML = `
      <h3>${recipe.strMeal}</h3> <!-- Título da receita -->
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}"> <!-- Imagem da receita -->
      <p><strong>Ingredientes:</strong> ${getIngredients(recipe)}</p> <!-- Lista de ingredientes -->
      <p><strong>Link:</strong> <a href="${recipe.strSource}" target="_blank">${recipe.strMeal}</a></p> <!-- Link para a fonte da receita -->
    `;
    ul.appendChild(li); // Adiciona o item de lista à lista não ordenada
  });

  resultsContainer.appendChild(ul); // Adiciona a lista de receitas ao contêiner de resultados
}

// Função para obter a lista de ingredientes formatada
function getIngredients(recipe) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) { // Itera sobre até 20 ingredientes (convenção da API)
    const ingredientName = recipe[`strIngredient${i}`]; // Obtém o nome do ingrediente
    const measure = recipe[`strMeasure${i}`]; // Obtém a medida do ingrediente

    if (ingredientName) {
      ingredients.push(`${measure} ${ingredientName}`); // Adiciona o ingrediente e sua medida à lista
    }
  }
  return ingredients.join(', '); // Retorna a lista de ingredientes como uma string separada por vírgula
}
