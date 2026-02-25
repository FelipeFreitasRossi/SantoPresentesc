import sqlite3
import os
import json
from datetime import datetime

def conectar_banco():
    """Conecta ao banco de dados SQLite"""
    conn = sqlite3.connect('produtos.db')
    return conn

def criar_tabela():
    """Cria a tabela de produtos com a coluna de imagens adicionais se não existir"""
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            categoria TEXT NOT NULL,
            estampa INTEGER DEFAULT 1,
            capuz INTEGER DEFAULT 0,
            tamanhos TEXT,
            imagemUrl TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute("PRAGMA table_info(produtos)")
    colunas = [coluna[1] for coluna in cursor.fetchall()]
    if 'imagensAdicionais' not in colunas:
        cursor.execute("ALTER TABLE produtos ADD COLUMN imagensAdicionais TEXT")
        print("✅ Coluna 'imagensAdicionais' adicionada à tabela.")
    
    conn.commit()
    conn.close()
    print("✅ Tabela criada/verificada com sucesso!")

def adicionar_produto():
    """Adiciona um novo produto ao banco com até 2 imagens extras"""
    print("\n--- NOVO PRODUTO ---")
    
    nome = input("Nome do produto: ")
    descricao = input("Descrição: ")
    preco = float(input("Preço (ex: 89.90): "))
    
    print("\nCategorias disponíveis:")
    print("1 - Camisa")
    print("2 - Moletom")
    print("3 - Oversized")
    print("4 - Babylooks")
    opcao = input("Escolha a categoria (1-4): ")
    
    categorias = {
        '1': 'camisa',
        '2': 'moletom', 
        '3': 'oversized',
        '4': 'babylooks'
    }
    categoria = categorias.get(opcao, 'camisa')
    
    estampa = input("Tem estampa? (s/n): ").lower() == 's'
    
    if categoria == 'moletom':
        capuz = input("Tem capuz? (s/n): ").lower() == 's'
    else:
        capuz = False
    
    print("\nTamanhos disponíveis (separados por vírgula, ex: P,M,G,GG):")
    tamanhos_input = input("Tamanhos: ")
    tamanhos = tamanhos_input.replace(' ', '').split(',')
    
    imagemUrl = input("URL da imagem principal (obrigatório): ")
    while not imagemUrl:
        imagemUrl = input("URL da imagem principal é obrigatória: ")
    
    imagens_extras = []
    print("\n📸 Imagens adicionais (você pode adicionar de 1 a 2 imagens):")
    
    while len(imagens_extras) < 2:
        opcao_extra = input(f"Adicionar imagem extra {len(imagens_extras)+1}? (s/n): ").lower()
        if opcao_extra == 's':
            extra = input(f"URL da imagem extra {len(imagens_extras)+1}: ").strip()
            if extra:
                imagens_extras.append(extra)
            else:
                print("URL inválida. Tente novamente.")
        else:
            if len(imagens_extras) == 0:
                print("É obrigatório pelo menos 1 imagem adicional. Continue.")
            else:
                break
    
    if len(imagens_extras) == 0:
        print("\n⚠️ É obrigatório pelo menos 1 imagem adicional. Adicione agora:")
        while len(imagens_extras) < 1:
            extra = input(f"URL da imagem extra 1: ").strip()
            if extra:
                imagens_extras.append(extra)
            else:
                print("URL inválida.")
    
    imagens_extras_str = "|".join(imagens_extras) if imagens_extras else None
    
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO produtos 
        (nome, descricao, preco, categoria, estampa, capuz, tamanhos, imagemUrl, imagensAdicionais)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (nome, descricao, preco, categoria, estampa, capuz, ','.join(tamanhos), imagemUrl, imagens_extras_str))
    
    conn.commit()
    conn.close()
    
    print(f"\n✅ Produto '{nome}' adicionado com sucesso com {len(imagens_extras)} imagem(ns) extra(s)!")

def listar_produtos():
    """Lista todos os produtos do banco"""
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, nome, preco, categoria, imagemUrl, imagensAdicionais FROM produtos ORDER BY id')
    produtos = cursor.fetchall()
    
    if not produtos:
        print("\n📭 Nenhum produto cadastrado.")
        return
    
    print("\n" + "="*90)
    print(f"{'ID':<4} {'NOME':<25} {'PREÇO':<8} {'CATEGORIA':<12} {'IMG PRINCIPAL':<20} {'IMGS EXTRAS'}")
    print("="*90)
    
    for p in produtos:
        extras = p[5] if p[5] else "0"
        if extras and extras != "0":
            qtd = len(extras.split('|'))
            extras_info = f"{qtd} imagem(ns)"
        else:
            extras_info = "0"
        print(f"{p[0]:<4} {p[1][:25]:<25} R${p[2]:<7.2f} {p[3][:12]:<12} {p[4][:20]:<20} {extras_info}")
    
    conn.close()

def editar_produto():
    """Edita um produto existente (incluindo imagens adicionais)"""
    listar_produtos()
    
    try:
        id_produto = int(input("\nID do produto para editar: "))
        
        conn = conectar_banco()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM produtos WHERE id = ?', (id_produto,))
        produto = cursor.fetchone()
        
        if not produto:
            print("❌ Produto não encontrado!")
            return
        
        imagens_atual = produto[10] if len(produto) > 10 and produto[10] else ""
        
        print("\nDeixe em branco para manter o valor atual")
        
        novo_nome = input(f"Nome [{produto[1]}]: ") or produto[1]
        nova_descricao = input(f"Descrição [{produto[2]}]: ") or produto[2]
        novo_preco = input(f"Preço [{produto[3]}]: ")
        novo_preco = float(novo_preco) if novo_preco else produto[3]
        
        print(f"\nImagens adicionais atuais: {imagens_atual if imagens_atual else 'Nenhuma'}")
        alterar_imagens = input("Deseja alterar as imagens adicionais? (s/n): ").lower()
        novas_imagens = imagens_atual
        if alterar_imagens == 's':
            extras = []
            print("Adicione as novas imagens (mínimo 1, máximo 2):")
            while len(extras) < 2:
                opcao_extra = input(f"Adicionar imagem extra {len(extras)+1}? (s/n): ").lower()
                if opcao_extra == 's':
                    extra = input(f"URL da imagem extra {len(extras)+1}: ").strip()
                    if extra:
                        extras.append(extra)
                    else:
                        print("URL inválida.")
                else:
                    if len(extras) == 0:
                        print("É obrigatório pelo menos 1 imagem adicional. Continue.")
                    else:
                        break
            if len(extras) == 0:
                print("Nenhuma imagem adicionada, mantendo as anteriores.")
            else:
                novas_imagens = "|".join(extras)
        
        cursor.execute('''
            UPDATE produtos 
            SET nome = ?, descricao = ?, preco = ?, imagensAdicionais = ?
            WHERE id = ?
        ''', (novo_nome, nova_descricao, novo_preco, novas_imagens if novas_imagens else None, id_produto))
        
        conn.commit()
        conn.close()
        
        print(f"✅ Produto atualizado!")
        
    except ValueError:
        print("❌ Valor inválido!")

def deletar_produto():
    """Remove um produto"""
    listar_produtos()
    
    try:
        id_produto = int(input("\nID do produto para deletar: "))
        
        confirmar = input(f"Tem certeza? (s/n): ").lower()
        
        if confirmar == 's':
            conn = conectar_banco()
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM produtos WHERE id = ?', (id_produto,))
            
            conn.commit()
            conn.close()
            
            print(f"✅ Produto removido!")
        else:
            print("Operação cancelada.")
            
    except ValueError:
        print("❌ Valor inválido!")

def exportar_para_app():
    """Exporta produtos do SQLite para o formato TypeScript do app (inclui imagens adicionais)"""

    CAMINHO_DESTINO = r"C:\Users\User\Desktop\SantoPresentesc\app-expo\app\data\produtos.ts"
    
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM produtos ORDER BY id')
    produtos = cursor.fetchall()
     
    if not produtos:
        print("⚠️ Nenhum produto para exportar!")
        return
    
    ts_content = """import { Produto } from '../types';

export const produtos: Produto[] = [
"""
    
    for p in produtos:
 
        id = p[0]
        nome = p[1]
        descricao = p[2]
        preco = p[3]
        categoria = p[4]
        estampa = bool(p[5])
        capuz = bool(p[6]) if categoria == 'moletom' else False
        tamanhos_str = p[7] if p[7] else "P,M,G,GG"
        tamanhos_array = tamanhos_str.split(',')
        imagemUrl = p[8] if p[8] else ''
        imagens_adicionais_str = p[10] if len(p) > 10 and p[10] else None
        
        if imagens_adicionais_str:
            imagens_array = imagens_adicionais_str.split('|')
            imagens_json = json.dumps(imagens_array)
        else:
            imagens_json = 'undefined'
        
        produto_ts = f"""  {{
    id: {id},
    nome: "{nome}",
    descricao: "{descricao}",
    preco: {preco},
    categoria: "{categoria}",
    estampa: {str(estampa).lower()},
    {f'capuz: {str(capuz).lower()},' if categoria == 'moletom' else ''}
    tamanhos: {json.dumps(tamanhos_array)},
    imagemUrl: "{imagemUrl}",
    imagensAdicionais: {imagens_json}
  }},
"""
        ts_content += produto_ts
    
    ts_content += "];\n"
    
    os.makedirs(os.path.dirname(CAMINHO_DESTINO), exist_ok=True)
    
    try:
        with open(CAMINHO_DESTINO, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        print(f"✅ Arquivo exportado para: {CAMINHO_DESTINO}")
        print(f"📦 Total de produtos: {len(produtos)}")
    except Exception as e:
        print(f"❌ Erro ao salvar: {e}")
        print("💡 Verifique o caminho do arquivo.")
    
    conn.close()

def menu_principal():
    """Menu interativo principal"""
    criar_tabela()
    
    while True:
        print("\n" + "="*50)
        print("🗄️  GERENCIADOR DE PRODUTOS (com imagens adicionais)")
        print("="*50)
        print("1 - 📋 Listar produtos")
        print("2 - ➕ Adicionar produto")
        print("3 - ✏️  Editar produto")
        print("4 - ❌ Deletar produto")
        print("5 - 📤 Exportar para o app")
        print("0 - Sair")
        
        opcao = input("\nEscolha uma opção: ")
        
        if opcao == '1':
            listar_produtos()
        elif opcao == '2':
            adicionar_produto()
        elif opcao == '3':
            editar_produto()
        elif opcao == '4':
            deletar_produto()
        elif opcao == '5':
            exportar_para_app()
        elif opcao == '0':
            print("👋 Até logo!")
            break
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    menu_principal()