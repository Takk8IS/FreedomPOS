# Manual do Freedom POS para Iniciantes

Este manual simples irá guiá-lo por todo o processo de download, instalação, execução e geração das versões web e desktop do Freedom POS.

## Índice

1. [Requisitos Básicos](#requisitos-básicos)
2. [Baixando o Freedom POS](#baixando-o-freedom-pos)
3. [Instalação](#instalação)
4. [Executando a Versão Web](#executando-a-versão-web)
5. [Executando a Versão Desktop](#executando-a-versão-desktop)
6. [Gerando a Versão Web Localmente](#gerando-a-versão-web-localmente)
7. [Gerando as Versões Desktop](#gerando-as-versões-desktop)
8. [Solução de Problemas Comuns](#solução-de-problemas-comuns)

## Requisitos Básicos

Para trabalhar com o Freedom POS, você precisará de:

- Um computador com Windows 10/11, macOS ou Linux
- Acesso à internet
- Aproximadamente 4GB de espaço livre em disco
- Pelo menos 4GB de RAM (8GB recomendado)

## Baixando o Freedom POS

### Para usuários comuns (maneira mais simples)

Se você apenas deseja usar o Freedom POS sem modificá-lo:

1. Visite a página de releases: [https://github.com/Takk8IS/FreedomPOS/releases](https://github.com/Takk8IS/FreedomPOS/releases)
2. Baixe a versão mais recente para o seu sistema operacional:
    - Para Windows: arquivo `.msi`
    - Para macOS: arquivo `.dmg`
    - Para Linux: arquivo `.AppImage` ou `.deb`

### Para desenvolvedores e usuários avançados

Se você deseja modificar, executar ou compilar o Freedom POS a partir do código-fonte:

1. Instale o Git:

    - **Windows**: Baixe e instale do [site oficial do Git](https://git-scm.com/download/win)
    - **macOS**: Abra o Terminal e digite `xcode-select --install`
    - **Linux**: Use `sudo apt install git` (Ubuntu/Debian) ou comando equivalente para sua distribuição

2. Abra o terminal (ou prompt de comando no Windows)

3. Clone o repositório com o comando:

    ```
    git clone https://github.com/Takk8IS/FreedomPOS.git
    ```

4. Entre na pasta do projeto:
    ```
    cd FreedomPOS
    ```

## Instalação

Se você baixou uma versão pré-compilada (arquivo .msi, .dmg ou .AppImage), basta executar o instalador e seguir as instruções na tela.

Para trabalhar com o código-fonte, siga estas etapas:

### 1. Instale o Node.js

O Node.js é necessário para executar e compilar o projeto.

- **Windows/macOS**:

    1. Acesse [https://nodejs.org/](https://nodejs.org/)
    2. Baixe a versão LTS (recomendada)
    3. Execute o instalador e siga as instruções

- **Linux**:
    ```
    sudo apt update
    sudo apt install nodejs npm
    ```

### 2. Instale o Rust (necessário para a versão desktop)

- **Windows**:

    1. Baixe e execute o [instalador do Rust](https://www.rust-lang.org/tools/install)
    2. Siga as instruções na tela

- **macOS/Linux**:
    1. Abra o terminal e execute:
        ```
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        ```
    2. Siga as instruções e selecione a instalação padrão
    3. Após a instalação, feche e reabra o terminal

### 3. Instale dependências adicionais para compilação

- **Windows**:

    1. Instale as [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
    2. Durante a instalação, selecione "Desenvolvimento para Desktop com C++"

- **macOS**:

    ```
    xcode-select --install
    ```

- **Linux** (Ubuntu/Debian):
    ```
    sudo apt update
    sudo apt install libwebkit2gtk-4.0-dev build-essential libssl-dev libgtk-3-dev libappindicator3-dev librsvg2-dev
    ```

### 4. Instale as dependências do projeto

No terminal, dentro da pasta do projeto, execute:

```
npm install
```

Aguarde a conclusão da instalação (pode levar alguns minutos).

## Executando a Versão Web

Para executar a versão web localmente:

1. No terminal, na pasta do projeto, execute:

    ```
    npm run dev
    ```

2. Aguarde até ver uma mensagem informando que o servidor está pronto.

3. Abra seu navegador e acesse:

    ```
    http://localhost:3000
    ```

4. Para parar o servidor, volte ao terminal e pressione `Ctrl+C`

## Executando a Versão Desktop

Para executar a versão desktop durante o desenvolvimento:

1. No terminal, na pasta do projeto, execute:

    ```
    npm run tauri dev
    ```

2. Aguarde a compilação (pode demorar alguns minutos na primeira vez).

3. O aplicativo desktop será iniciado automaticamente.

4. Para encerrar, feche a janela do aplicativo e pressione `Ctrl+C` no terminal.

## Gerando a Versão Web Localmente

Para criar uma versão publicável do site:

1. No terminal, na pasta do projeto, execute:

    ```
    npm run build
    ```

2. Aguarde a conclusão do processo de build.

3. Os arquivos da versão web estarão na pasta `out`.

4. Para testar localmente, você pode usar:

    ```
    npx serve out
    ```

5. Para publicar, basta copiar o conteúdo da pasta `out` para seu servidor web.

## Gerando as Versões Desktop

### Gerando para seu sistema atual

Para gerar uma versão desktop para o sistema operacional que você está usando:

1. No terminal, na pasta do projeto, execute:

    ```
    npm run tauri build
    ```

2. Aguarde a conclusão do processo de build (pode levar vários minutos).

3. Os arquivos de instalação serão gerados na pasta:

    ```
    src-tauri/target/release/bundle/
    ```

4. Você encontrará o instalador apropriado para seu sistema:
    - Windows: arquivo `.msi`
    - macOS: arquivo `.dmg` e pasta `.app`
    - Linux: arquivos `.AppImage`, `.deb` e outros dependendo da distribuição

### Gerando para outros sistemas operacionais

Em geral, **não é possível** compilar diretamente um instalador para um sistema operacional diferente do que você está usando. Por exemplo, você não pode gerar um instalador macOS a partir do Windows.

Para gerar instaladores para todos os sistemas, você tem as seguintes opções:

#### Opção 1: Usar GitHub Actions (Recomendado)

O Freedom POS já possui configurações para compilação automática. Para usar:

1. Faça um fork do repositório para sua conta do GitHub
2. Faça as alterações desejadas no código
3. Crie uma nova tag de versão:
    ```
    git tag v1.0.x
    git push origin v1.0.x
    ```
4. O GitHub Actions irá automaticamente compilar versões para Windows, macOS e Linux
5. Você poderá baixar os instaladores da seção "Releases" do seu repositório

#### Opção 2: Usar máquinas virtuais ou contêineres

Você pode configurar máquinas virtuais com os diferentes sistemas operacionais e fazer a compilação em cada um deles.

## Solução de Problemas Comuns

### Erro "Comando não encontrado"

- Verifique se o Node.js está instalado corretamente
- Feche e reabra o terminal
- Verifique se você está na pasta correta do projeto

### Erros durante npm install

- Verifique sua conexão com a internet
- Tente executar `npm cache clean --force` e depois tente novamente
- Se estiver em uma rede corporativa, verifique as configurações de proxy

### Erros na compilação da versão desktop

- Verifique se o Rust está instalado corretamente
- Execute `rustup update` para atualizar o Rust
- Verifique se todas as dependências do sistema foram instaladas
- Verifique o espaço disponível no disco

### A aplicação web não abre

- Verifique se o servidor está rodando (deve mostrar mensagens no terminal)
- Tente acessar usando outro navegador
- Verifique se a porta 3000 não está bloqueada pelo firewall

### Janela do aplicativo desktop aparece em branco

- Verifique os logs no terminal para identificar erros
- Tente reinstalar as dependências com `npm install`
- Verifique se seu sistema atende aos requisitos mínimos

### Onde obter ajuda adicional

- Verifique a [documentação oficial](https://github.com/Takk8IS/FreedomPOS/docs/)
- Visite a [seção de issues](https://github.com/Takk8IS/FreedomPOS/issues) para problemas conhecidos
- Crie uma nova issue detalhando seu problema se não encontrar solução

---

Este manual foi criado para ajudar iniciantes a trabalhar com o Freedom POS. Para informações mais detalhadas, consulte a documentação completa no repositório.

## Licence

Copyright (c)
License: Attribution 4.0 International (CC BY 4.0)
Author: David C Cavalcante

## Donations

If this project has been helpful, consider making a donation:

**USDT (TRC-20)**: `TP6zpvjt2ZNGfWKPevfp65ZrcbKMWSQXDi`

Your support helps us continue to develop innovative tools.

## Support

To contribute to public and social projects focused on research and artificial intelligence, feel free to support with any amount you prefer.

## About the Author

David C Cavalcante

- Philosopher & Writer, Artificial Intelligence Consultant Tech Lead, Researcher & Author, Strategic Marketing & Design Specialist, Developer & Software Engineer

- **LinkedIn**: [linkedin.com/in/hellodav](https://linkedin.com/in/hellodav/)
- **Medium**: [medium.com/@davcavalcante](https://medium.com/@davcavalcante/)

Takk™ Innovate Studio

- Positive results, rapid innovation
- Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team

- **GitHub**: [github.com/takk8is](https://github.com/takk8is)
- **X**: [x.com/takk8is](https://x.com/takk8is/)
- **Medium**: [takk8is.medium.com](https://takk8is.medium.com/)
- **URL**: [takk.ag](https://takk.ag/)
