import sqlite3
import os
from datetime import datetime

def conectar_banco():
    """Conecta ao banco de dados SQLite"""
    conn = sqlite3.connect('produtos.db')
    return conn

def criar_tabela():
    """Cria a tabela de produtos se não existir"""
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
    
    conn.commit()
    conn.close()
    print("✅ Tabela criada/verificada com sucesso!")

def adicionar_produto():
    """Adiciona um novo produto ao banco"""
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
    
    imagemUrl = input("URL da imagem (ou deixe em branco): ")
    
    # Inserir no banco
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO produtos 
        (nome, descricao, preco, categoria, estampa, capuz, tamanhos, imagemUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (nome, descricao, preco, categoria, estampa, capuz, ','.join(tamanhos), imagemUrl))
    
    conn.commit()
    conn.close()
    
    print(f"\n✅ Produto '{nome}' adicionado com sucesso!")

def listar_produtos():
    """Lista todos os produtos do banco"""
    conn = conectar_banco()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM produtos ORDER BY id')
    produtos = cursor.fetchall()
    
    if not produtos:
        print("\n📭 Nenhum produto cadastrado.")
        return
    
    print("\n" + "="*80)
    print(f"{'ID':<4} {'NOME':<25} {'PREÇO':<8} {'CATEGORIA':<12} {'ESTOQUE':<8}")
    print("="*80)
    
    for p in produtos:
        print(f"{p[0]:<4} {p[1][:25]:<25} R${p[3]:<7.2f} {p[4][:12]:<12}")
    
    conn.close()

def editar_produto():
    """Edita um produto existente"""
    listar_produtos()
    
    try:
        id_produto = int(input("\nID do produto para editar: "))
        
        conn = conectar_banco()
        cursor = conn.cursor()
        
        # Buscar produto atual
        cursor.execute('SELECT * FROM produtos WHERE id = ?', (id_produto,))
        produto = cursor.fetchone()
        
        if not produto:
            print("❌ Produto não encontrado!")
            return
        
        print("\nDeixe em branco para manter o valor atual")
        
        novo_nome = input(f"Nome [{produto[1]}]: ") or produto[1]
        nova_descricao = input(f"Descrição [{produto[2]}]: ") or produto[2]
        novo_preco = input(f"Preço [{produto[3]}]: ")
        novo_preco = float(novo_preco) if novo_preco else produto[3]
        
        cursor.execute('''
            UPDATE produtos 
            SET nome = ?, descricao = ?, preco = ?
            WHERE id = ?
        ''', (novo_nome, nova_descricao, novo_preco, id_produto))
        
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

def menu_principal():
    """Menu interativo principal"""
    criar_tabela()
    
    while True:
        print("\n" + "="*50)
        print("🗄️  GERENCIADOR DE PRODUTOS")
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
            # Vamos criar esse script depois
            print("Executar exportar_para_app.py manualmente")
            os.system('python exportar_para_app.py')
        elif opcao == '0':
            print("👋 Até logo!")
            break
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    menu_principal()