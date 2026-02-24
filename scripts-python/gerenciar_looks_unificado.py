import sqlite3
import os
import json

CAMINHO_PROJETO = r"C:\Users\User\Desktop\SantoPresentesc\app-expo" 

def conectar():
    return sqlite3.connect('produtos.db')

def criar_tabela():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS looks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagemUrl TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Tabela 'looks' pronta.")

def adicionar():
    url = input("URL da imagem: ").strip()
    if not url:
        print("❌ URL obrigatória!")
        return
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO looks (imagemUrl) VALUES (?)', (url,))
    conn.commit()
    conn.close()
    print("✅ Look adicionado!")

def listar():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT id, imagemUrl FROM looks ORDER BY id')
    looks = cursor.fetchall()
    conn.close()
    if not looks:
        print("\n📭 Nenhum look cadastrado.")
    else:
        print("\n" + "="*60)
        print(f"{'ID':<4} {'IMAGEM URL':<50}")
        print("="*60)
        for l in looks:
            print(f"{l[0]:<4} {l[1][:50]:<50}")

def deletar():
    listar()
    try:
        id_look = int(input("\nID do look para deletar: "))
        confirmar = input("Tem certeza? (s/n): ").lower()
        if confirmar == 's':
            conn = conectar()
            cursor = conn.cursor()
            cursor.execute('DELETE FROM looks WHERE id = ?', (id_look,))
            conn.commit()
            conn.close()
            print("✅ Look removido!")
    except ValueError:
        print("❌ ID inválido!")

def exportar():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT id, imagemUrl FROM looks ORDER BY id')
    looks = cursor.fetchall()
    conn.close()

    # Gera o conteúdo do arquivo TypeScript
    ts_content = """// app/data/looks.ts
// Gerado automaticamente pelo script Python

export type Look = {
  id: number;
  imagemUrl: string;
};

export const looks: Look[] = [
"""
    for l in looks:
        ts_content += f"  {{ id: {l[0]}, imagemUrl: \"{l[1]}\" }},\n"
    ts_content += "];\n"

    # Define o caminho completo para o arquivo no projeto Expo
    caminho_arquivo = os.path.join(CAMINHO_PROJETO, "app", "data", "looks.ts")
    
    # Cria a pasta se não existir
    os.makedirs(os.path.dirname(caminho_arquivo), exist_ok=True)

    with open(caminho_arquivo, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"✅ Arquivo looks.ts gerado em: {caminho_arquivo}")

def menu():
    criar_tabela()
    while True:
        print("\n" + "="*40)
        print("📸 GERENCIAR LOOKS (UNIFICADO)")
        print("="*40)
        print("1 - Listar looks")
        print("2 - Adicionar look")
        print("3 - Deletar look")
        print("4 - Exportar looks (gera looks.ts)")
        print("0 - Sair")
        opcao = input("\nEscolha: ")
        if opcao == '1':
            listar()
        elif opcao == '2':
            adicionar()
        elif opcao == '3':
            deletar()
        elif opcao == '4':
            exportar()
        elif opcao == '0':
            break
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    menu()