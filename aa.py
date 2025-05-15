import numpy as np

# Função de ativação degrau (step function)
def step_function(x):
    return 1 if x >= 0 else 0

# Perceptron simples
def perceptron(entradas, pesos, bias):
    # Soma ponderada: entradas * pesos + bias
    soma = np.dot(entradas, pesos) + bias
    # Aplica a função de ativação
    return step_function(soma)

# Exemplo de dados de entrada (ex: idade normalizada, peso normalizado)
entradas = np.array([0.6, 0.8])  # exemplo: idade=60 anos → 0.6, peso=80kg → 0.8

# Pesos arbitrários
pesos = np.array([0.5, 0.3])

# Bias (valor constante somado à soma ponderada)
bias = -0.4

# Resultado
saida = perceptron(entradas, pesos, bias)

print("Saída do perceptron:", saida)
