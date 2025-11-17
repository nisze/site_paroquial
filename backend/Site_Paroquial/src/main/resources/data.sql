-- Noticias (da Home)
INSERT INTO noticias (titulo, conteudo, resumo, autor, data_publicacao, tipo, ativo, imagem_url, data_criacao) VALUES
('Campanha do Quilo 2025', 'Participe da nossa campanha solidaria! Estamos arrecadando alimentos nao pereciveis para ajudar familias carentes da nossa comunidade. Traga sua contribuicao todos os domingos apos as missas. Sua solidariedade faz a diferenca!', 'Participe da nossa campanha solidaria! Estamos arrecadando alimentos nao pereciveis para ajudar familias carentes da nossa comunidade.', 'Secretaria Paroquial', '2025-11-15', 'Comunicado', true, 'kilo2.png', CURRENT_TIMESTAMP),
('Festa de Nossa Senhora Aparecida', 'Celebramos com grande festa a padroeira do Brasil. Missas solenes, procissao e confraternizacao com toda a comunidade. Programacao especial durante todo o dia 12 de outubro. Venha participar!', 'Celebramos com grande festa a padroeira do Brasil. Missas solenes, procissao e confraternizacao com toda a comunidade.', 'Pe. Joao Silva', '2025-10-12', 'Evento', true, 'festa.png', CURRENT_TIMESTAMP),
('Preparacao para o Advento', 'Inicia-se o tempo do Advento. Prepare seu coracao para acolher o Menino Jesus com oracoes e reflexoes especiais. Retiro de Advento e Via Sacra todas as sextas-feiras.', 'Inicia-se o tempo do Advento. Prepare seu coracao para acolher o Menino Jesus com oracoes e reflexoes especiais.', 'Coordenacao Liturgica', '2025-11-30', 'Aviso', true, 'advento.png', CURRENT_TIMESTAMP);

-- Eventos
INSERT INTO eventos (titulo, descricao, data, hora, local, tipo, ativo, imagem_url, data_criacao) VALUES
('Missa Solene', 'Celebracao da Padroeira', '2025-10-12', '10:00:00', 'Igreja Matriz', 'MISSA', true, 'https://www.vaticannews.va/content/dam/vaticannews/web/banner/banner%20santi.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg', CURRENT_TIMESTAMP),
('Reuniao Pastoral', 'Reuniao mensal', '2025-10-25', '19:30:00', 'Salao', 'ENCONTRO', true, null, CURRENT_TIMESTAMP);

-- Pastorais (da Home)
INSERT INTO pastorais (nome, descricao, coordenador, contato, horario, tipo, ativo, imagem_url, data_criacao) VALUES
('Pastoral Liturgica', 'A Pastoral Liturgica e responsavel pela animacao e preparacao das celebracoes liturgicas, cuidando da musica, leitores, ministros extraordinarios da Eucaristia e ornamentacao da igreja. Missao: tornar as celebracoes mais vivas e participativas.', 'Pe. Carlos Alberto', '(11) 98765-4321', 'Quintas-feiras as 20h', 'Liturgica', true, 'pastoral.png', CURRENT_TIMESTAMP),
('Pastoral da Caridade', 'A Pastoral da Caridade desenvolve acoes sociais e presta auxilio as familias necessitadas da paroquia e regiao. Distribuicao de cestas basicas, roupas, atendimento a moradores de rua e visita a enfermos. O amor de Cristo em acao.', 'Maria Aparecida Silva', '(11) 97654-3210', 'Tercas-feiras as 19h30', 'Social', true, 'caridade.png', CURRENT_TIMESTAMP),
('Pastoral da Crianca', 'A Pastoral da Crianca realiza o acompanhamento e cuidado com as criancas de 0 a 6 anos, orientando familias sobre saude, nutricao, educacao e cidadania. Promovendo o desenvolvimento integral das criancas em situacao de vulnerabilidade.', 'Ana Paula Oliveira', '(11) 96543-2109', 'Sabados as 9h', 'Infancia', true, 'crianca.png', CURRENT_TIMESTAMP),
('Pastoral Familiar', 'A Pastoral Familiar trabalha pelo fortalecimento dos lacos familiares cristaos, oferecendo cursos de preparacao para o matrimonio, encontros de casais, grupos de reflexao e aconselhamento familiar. A familia e a Igreja domestica.', 'Jose e Regina Costa', '(11) 95432-1098', 'Ultimos sabados do mes as 16h', 'Familia', true, 'familiar.png', CURRENT_TIMESTAMP);

-- Santos - Novembro 2025 (Semana da apresentacao - Vatican News)
INSERT INTO santos (nome, biografia, oracao, dia, mes, festa_liturgica, imagem_url, data_criacao) VALUES
-- 16 de Novembro - Santa Margarida da Escocia (Vatican News)
('Santa Margarida da Escocia',
'Margarida nasceu na Hungria por volta de 1046, filha do principe Eduardo da Inglaterra. Apos a conquista normanda, refugiou-se na Escocia onde casou-se com o rei Malcolm III. Como rainha, dedicou-se aos pobres, fundou hospitais e igrejas, e trabalhou pela reforma liturgica. Mae de oito filhos, entre eles tres futuros reis, equilibrou suas responsabilidades reais com intensa vida de oracao e caridade. Conhecida por sua piedade, generosidade e influencia na cristianizacao da Escocia. Foi canonizada em 1250.',
'Santa Margarida da Escocia, rainha e mae exemplar, que soubestes unir a vida de palacio com a santidade evangelica, intercedei pelas maes e rainhas do lar. Ensinai-nos a servir aos pobres com generosidade e a educar os filhos nos caminhos do Senhor. Ajudai-nos a encontrar tempo para a oracao em meio as ocupacoes diarias. Que vosso exemplo de caridade e piedade inspire as familias cristas. Amem.',
16, 11, 'Memoria Facultativa', 'https://www.vaticannews.va/content/dam/vaticannews/santi/20181116_Wikimedia%20Commons_sec.%20XII_MARGHERITA%20DI%20SCOZIA.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.250.141.jpeg', CURRENT_TIMESTAMP),

-- 17 de Novembro - Santa Isabel da Hungria (Vatican News)
('Santa Isabel da Hungria', 
'Quando Isabel faleceu, aos 24 anos, era considerada "Santa" por muitos. Foi noiva aos 14 anos, mãe aos 15 e viúva aos 20. Tendo ficado sozinha escolheu a pobreza franciscana da Ordem Terceira. Visitou e assistiu os doentes, mesmo os fétidos, não obstante a sua soberana linhagem do trono da Hungria. Santa Isabel nasceu princesa, filha do rei André II da Hungria, e dedicou sua vida aos pobres e doentes após a morte do marido nas Cruzadas. Foi canonizada em 1235 pelo Papa Gregório IX.',
'Santa Isabel da Hungria, terciária franciscana, que renunciastes às riquezas terrenas para servir aos pobres e doentes, ensinai-nos a partilhar nossos bens com generosidade e amor. Intercedei por todos aqueles que trabalham nas obras de caridade e pelos que sofrem na pobreza e na doença. Ajudai-nos a ver o rosto de Cristo em cada necessitado. Amém.',
17, 11, 'Memoria Obrigatoria', 'https://www.vaticannews.va/content/dam/vaticannews/santi/20181117_Wikimedia%20Commons_Bonnefanten%20Museum_Pietro%20Nelli_1365%20ca._ELISABETTA%20D''UNGHERIA.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.250.141.jpeg', CURRENT_TIMESTAMP),

-- 18 de Novembro - Santa Filipina Rosa Duchesne (Vatican News)
('Santa Filipina Rosa Duchesne', 
'Filipina estudou nas Visitandinas de Grenoble, mas a Revolução Francesa a impediu de se tornar religiosa. Quando tudo voltou à normalidade, em 1801, entrou para a Sociedade do Sagrado Coração, onde realizou seu sonho de ser missionária no estado de Louisiana, EUA, onde fundou uma nova comunidade. Dedicou-se à educação e evangelização dos povos indígenas e foi canonizada em 1988.',
'Santa Filipina Rosa Duchesne, missionária incansável, que atravessastes o oceano para levar o amor de Cristo às terras distantes, intercedei pelos missionários e educadores. Ensinai-nos a perseverar na oração e no serviço, mesmo diante das dificuldades. Ajudai-nos a ser instrumentos do Sagrado Coração de Jesus em nossas comunidades. Amém.',
18, 11, 'Memoria Facultativa', 'https://www.vaticannews.va/content/dam/vaticannews/web/banner/banner%20santi.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg', CURRENT_TIMESTAMP),

-- 19 de Novembro - Santa Matilde (Mechtilde) (Vatican News)
('Santa Matilde', 
'Viveu na segunda metade do século XIII. Saxônia de nascimento, Santa Matilde entrou para a Comunidade das Irmãs Beneditinas de Rodersdorf. Tornando-se monja, foi para Helfta, onde sua irmã era abadessa. Ali se destacou por sua humildade e amabilidade, dirigiu o coro e teve várias visões místicas. Suas experiências espirituais e devoção ao Sagrado Coração influenciaram profundamente a espiritualidade cristã.',
'Santa Matilde, virgem beneditina, mestra de oração e devota do Coração de Jesus, ensinai-nos a contemplar o amor infinito de Cristo. Alcançai-nos a graça de uma vida de oração profunda e constante união com Deus. Intercedei pelos músicos, cantores e todos aqueles que servem na liturgia da Igreja. Ajudai-nos a louvar o Senhor com humildade e amabilidade. Amém.',
19, 11, 'Memoria Facultativa', 'https://www.vaticannews.va/content/dam/vaticannews/santi/20191119_Wikimedia-Comons_MATILDE.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.250.141.jpeg', CURRENT_TIMESTAMP),

-- 20 de Novembro - São Gelásio I, Papa (Vatican News)
('Sao Gelasio I', 
'Gelásio foi um Papa intrépido, que subiu ao trono em 496. Em quatro anos, extinguiu as correntes pagãs, as heresias, o maniqueísmo, o monofisismo e o pelagianismo, sobre o qual escreveu vários tratados. Alguns de seus princípios progressistas foram adotados pelo Concílio Vaticano II. Foi um defensor da autoridade papal e da ortodoxia católica, governando com firmeza e sabedoria.',
'São Gelásio I, Papa e doutor da Igreja, que defendestes com coragem a fé católica contra as heresias, intercedei pela Santa Igreja e pelo Santo Padre. Dai-nos firmeza na fé e sabedoria para discernir a verdade. Ajudai-nos a viver segundo os ensinamentos de Cristo e a defender a doutrina católica com caridade e justiça. Amém.',
20, 11, 'Memoria Facultativa', 'https://www.vaticannews.va/content/dam/vaticannews/santi/20181120_Basilica%20di%20san%20Paolo%20fuori%20le%20mura_medaglioni%20papi_GELASIO%20I.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.250.141.jpeg', CURRENT_TIMESTAMP);
