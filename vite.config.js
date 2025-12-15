// vite.config.js
// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo configura o Vite, que é a ferramenta usada para rodar o projeto
// React em modo desenvolvimento e também para gerar o build de produção.
//
// Aqui fazemos três coisas principais:
// 1) Dizemos ao Vite que vamos usar React (plugin @vitejs/plugin-react-swc);
// 2) Definimos uma Content Security Policy (CSP) mais rígida para produção;
// 3) Aplicamos essa CSP apenas no `preview` (simulação de produção), e NÃO em dev,
//    para não quebrar o hot reload e os scripts internos do Vite.
// -----------------------------------------------------------------------------

// `defineConfig` é uma função auxiliar do Vite que ajuda a escrever
// a configuração com melhor suporte de tipos/autocomplete.
import { defineConfig } from "vite";

// Plugin oficial do Vite para projetos React usando o compilador SWC.
// Ele é responsável por entender JSX/TSX, fazer transformações, HMR etc.
import react from "@vitejs/plugin-react-swc";

// Módulo 'path' do Node.js para resolver caminhos de arquivos.
import path from "path";

// -----------------------------------------------------------------------------
// DEFINIÇÃO DA CONTENT SECURITY POLICY (CSP) PARA PRODUÇÃO/PREVIEW
// -----------------------------------------------------------------------------
// A CSP é um cabeçalho de segurança que diz ao navegador de quais origens
// (domínios / protocolos) o site pode carregar scripts, estilos, imagens, etc.
// Isso ajuda a reduzir o risco de ataques como XSS (injeção de scripts).
const csp = [
  "default-src 'none'",

    "script-src 'self'",
    "script-src-elem 'self'",

    "style-src 'self'",
    "img-src 'self' data: http://localhost:3000 https://medicos-beckend.onrender.com/",
    "font-src 'self'",

    "connect-src 'self' http://localhost:3000 https://medicos-beckend.onrender.com/",
  
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",

    // Iframes/children não são usados para reCAPTCHA neste projeto
    "frame-src 'self'",

  "upgrade-insecure-requests",
].join("; ");

// -----------------------------------------------------------------------------
// EXPORTANDO A CONFIGURAÇÃO PARA O VITE
// -----------------------------------------------------------------------------
// `defineConfig` recebe um objeto com as opções do Vite e exporta como padrão.
// O Vite lê esse arquivo automaticamente quando você roda `npm run dev` ou `npm run build`.
export default defineConfig({
    // Nome do repositório no github
    base: "/",
    // Plugins que o Vite deve usar; aqui só estamos usando o plugin do React.
    plugins: [react()],

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DE ALIASES DE CAMINHO
    // ---------------------------------------------------------------------------
    // Permite usar '@' como um atalho para a pasta 'src'.
    // Ex: import Component from '@/components/Component'
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO (npm run dev)
    // ---------------------------------------------------------------------------
    server: {
        headers: {
            // Aqui poderíamos definir cabeçalhos extras para o servidor de DEV.
            // De propósito NÃO colocamos a CSP em desenvolvimento.
            //
            // Motivo:
            // - Em dev, o Vite injeta scripts especiais (HMR, React Fast Refresh, etc.)
            //   que usam scripts inline e outras coisas que uma CSP rígida bloquearia.
            // - Se colocarmos uma CSP muito restritiva aqui, o hot reload quebra e
            //   o ambiente de desenvolvimento fica cheio de erros de CSP.
            //
            // Por isso, deixamos SEM "Content-Security-Policy" no dev.
            // Quando você acessar via `npm run dev`, não terá essa CSP ativa.
        },
    },

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO `vite preview` (build local de produção)
    // ---------------------------------------------------------------------------
    // `vite preview` simula o comportamento do build de produção rodando em um
    // servidor estático local. Aqui já faz sentido aplicar a CSP rígida para
    // testar a segurança antes de subir para o servidor real.
    preview: {
        headers: {
            // Agora sim, aplicamos a Content Security Policy definida acima.
            "Content-Security-Policy": csp,
        },
    },
});
