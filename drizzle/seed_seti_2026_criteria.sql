-- SETI 2026 criteria from "2026 - SETI - Projeto.pdf".
-- Safe to run more than once: a criterion is inserted only when the same name
-- and point value do not already exist.

with criteria_to_seed (criteria_name, criteria_description, criteria_point) as (
  values
    ('Adivinha a Musica - Facil', 'Acertar uma musica de nivel facil na gincana Adivinha a Musica.', 40),
    ('Adivinha a Musica - Medio', 'Acertar uma musica de nivel medio na gincana Adivinha a Musica.', 60),
    ('Adivinha a Musica - Dificil', 'Acertar uma musica de nivel dificil na gincana Adivinha a Musica.', 80),
    ('Torta na Cara - Resposta correta', 'Ser o primeiro participante a responder corretamente uma pergunta de conhecimentos gerais.', 60),
    ('Torta na Cara - Resposta incorreta do adversario', 'Receber pontos quando um adversario responder incorretamente.', 30),
    ('Objeto Tech - Acerto', 'Identificar corretamente, apenas pelo tato, um objeto ou componente tecnologico.', 70),
    ('Show da Tecnologia - Pergunta facil', 'Responder corretamente uma pergunta facil no Show da Tecnologia.', 50),
    ('Show da Tecnologia - Pergunta media', 'Responder corretamente uma pergunta media no Show da Tecnologia.', 70),
    ('Show da Tecnologia - Pergunta dificil', 'Responder corretamente uma pergunta dificil no Show da Tecnologia.', 100),
    ('Perguntas sobre a palestra do dia - Acerto', 'Ser a primeira turma a responder corretamente uma pergunta sobre a palestra do dia.', 50),
    ('Bola no Copo - Acerto', 'Colocar a bola no copo dentro de 20 segundos sem usar as maos.', 80),
    ('Verdadeiro ou Falso Tech - Acerto', 'Responder corretamente uma afirmacao de verdadeiro ou falso sobre informatica.', 60),
    ('Verdadeiro ou Falso Tech - Erro do adversario', 'Receber pontos quando outra sala responder incorretamente.', 30),
    ('Melhor Caracterizacao da SETI', 'Ter a melhor caracterizacao da SETI, com fantasias, pinturas, banner e aderecos, mantendo o uniforme.', 500),
    ('Dormir durante palestras ou atividades oficiais', 'Dormir durante palestras ou atividades oficiais.', -95),
    ('Conduta desrespeitosa ou linguagem ofensiva', 'Ter conduta desrespeitosa ou usar linguagem ofensiva.', -90),
    ('Uso de aparelho celular', 'Usar aparelho celular durante palestras ou atividades.', -80),
    ('Conduta inadequada no deslocamento', 'Baderna, algazarra ou atitudes que comprometam a organizacao durante o deslocamento.', -80),
    ('Descumprimento das normas de uniforme', 'Descumprir as normas de uniforme.', -60),
    ('Conversas paralelas', 'Manter conversas paralelas durante palestras ou atividades.', -50),
    ('Deixar o local sujo no final do dia', 'Deixar o local sujo no final do dia.', -50),
    ('Descumprimento de orientacoes da organizacao', 'Descumprir orientacoes da organizacao.', -30),
    ('Ausencia no dia', 'Ausencia da turma no dia programado.', -10),
    ('Kahoot - Vencedor', 'Vencer a atividade Kahoot.', 200)
)
insert into criteria (criteria_name, criteria_description, criteria_point, is_criteria_public)
select criteria_name, criteria_description, criteria_point, true
from criteria_to_seed as candidate
where not exists (
  select 1
  from criteria as existing
  where existing.criteria_name = candidate.criteria_name
    and existing.criteria_point = candidate.criteria_point
);
