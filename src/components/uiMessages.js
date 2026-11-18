/**
 * Mensagens padrão em português para estados de interface (loading, erro, vazio, sucesso).
 */

export const UI_MESSAGES = {
  loading: {
    catalog: 'Carregando jogos do catálogo...',
    details: 'Carregando detalhes do jogo...',
    personalList: 'Carregando sua lista pessoal...',
  },
  error: {
    apiKeyMissing: 'Erro de configuração: Chave da API RAWG ausente ou inválida. Por favor, configure o arquivo .env.',
    network: 'Falha de conexão com a rede. Verifique sua internet e tente novamente.',
    notFound: 'Recurso não encontrado.',
    generic: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
    duplicateItem: 'Este jogo já está na sua lista pessoal e não pode ser adicionado novamente.',
    invalidStatus: 'Status inválido. Apenas "quero jogar", "jogando" ou "jogado" são permitidos.',
  },
  empty: {
    catalog: 'Nenhum jogo encontrado.',
    personalList: 'Sua lista pessoal está vazia. Adicione jogos do catálogo para começar a acompanhar seu progresso!',
    search: 'Nenhum resultado encontrado para a busca realizada.',
  },
  success: {
    addedToList: 'Jogo adicionado com sucesso à sua lista pessoal!',
    statusUpdated: 'Status do jogo atualizado com sucesso!',
  },
};

/**
 * Retorna uma mensagem de erro amigável baseada no código HTTP ou tipo de erro.
 * @param {number|string} errorType 
 * @returns {string}
 */
export function getErrorMessage(errorType) {
  if (errorType === 401 || errorType === '401') {
    return UI_MESSAGES.error.apiKeyMissing;
  }
  if (errorType === 404 || errorType === '404') {
    return UI_MESSAGES.error.notFound;
  }
  if (errorType === 'network' || errorType === 'TIMEOUT') {
    return UI_MESSAGES.error.network;
  }
  if (errorType === 'duplicate') {
    return UI_MESSAGES.error.duplicateItem;
  }
  if (errorType === 'invalid-status') {
    return UI_MESSAGES.error.invalidStatus;
  }
  return UI_MESSAGES.error.generic;
}
