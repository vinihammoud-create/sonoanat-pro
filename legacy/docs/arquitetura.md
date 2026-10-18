# Arquitetura e Engenharia Reversa: AnSo vs NYSORA

## 1. Origem dos Aplicativos
Na pasta de trabalho foram identificados dois pacotes APK/XAPK:
1. **AnSo (Anaesthesia Sonoanatomy v2.3.7 - `com.nekologic.anso`)**
   - **Framework**: Flutter / Dart
   - **Engine Gráfica**: Impeller / Skia (libflutter.so)
   - **Lógica e Estado**: BLoC pattern (`SonoanatomyItemBloc`, `FetchSonoanatomyItemUsecase`, `SonoanatomyOverlayItemEntity`).
   - **Armazenamento**: Firebase Firestore + Cloud Storage + Hive (cache local offline).
   - **Assets**: Ícones em vetores SVG ultra-leves (`assets/vectors/*.svg`) + Fontes tipográficas Roboto.

2. **NYSORA Nerve Blocks (v4.9.4 - `com.nysora`)**
   - **Framework**: React Native + Hermes VM (`index.android.bundle` compilado para Hermes Bytecode v0.3.1.25).
   - **UI Library**: React Native Paper, React Navigation, Reanimated.
   - **Assets Nativos**: `res/drawable-mdpi-v4/` com imagens das categorias anatômicas:
     - `assets_head_and_neckcopy.png`
     - `assets_upper_extremitycopy.png`
     - `assets_thorax_abdowallcopy.png`
     - `assets_lower_extremitycopy.png`
     - `assets_doctor.png`
     - `assets_nysora_logo_colored.png`

## 2. Estrutura de Seções e Conteúdo
Ambos os aplicativos dividem os bloqueios anestésicos por topografia anatômica e por aplicabilidade clínica prática:
- **Cabeça e Pescoço (Head & Neck)**: Plexo Cervical Superficial e Profundo.
- **Membro Superior (Upper Extremity)**:
  - Bloqueio Interescalênico (Ombro, clavícula)
  - Bloqueio Supraclavicular (Braço, cotovelo, antebraço, mão)
  - Bloqueio Infraclavicular (Braço distal, cotovelo, mão)
  - Bloqueio Axilar (Antebraço, punho e mão)
- **Tórax e Abdome (Thorax & Abdominal Wall)**:
  - Bloqueio TAP (Plano Transverso Abdominal)
  - Bloqueio Erector Spinae (ESPB)
  - Bloqueio PECS I & II / Serrátil Anterior
  - Bloqueio da Bainha do Reto
- **Membro Inferior (Lower Extremity)**:
  - Bloqueio do Nervo Femoral
  - Bloqueio do Canal Adutor (Safeno)
  - Bloqueio Ciático / Poplíteo
  - Bloqueio PENG (Pericapsular Nerve Group) para quadril
- **Sonoanatomia Avançada & POCUS**:
  - Acesso Vascular Guiado por US (Veia Jugular Interna, Subclávia, Femoral)
  - Avaliação Gástrica (Antro Gástrico para estômago cheio / broncoaspiração)
  - Ultrassom Pulmonar (Linhas A, Linhas B, Deslizamento Pleural, Pneumotórax)
  - Neuraxial / Coluna Lombar

## 3. Implementação da Versão Web
- Reconstruído em **HTML5 + CSS3 + Vanilla JavaScript**.
- Estruturado como Single Page Application (SPA) responsiva para desktop e dispositivos móveis.
- Sem dependência de servidores ou frameworks externos pesados.
- Integração das imagens e ícones reais extraídos dos dois aplicativos originais.
