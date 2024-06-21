//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------- Nome: LM Interview.js
//------------------- Doctype: LM Interview
//----------------- Descricao: Formatação de página, tratamento da digitação do doctype
//------------------ Contexto: Entrevistas dos usuários
//---------------------- Data: 20/04/2024
//--------------------- Autor: Eduardo Kuniyoshi (EK)
//--- Histórico de alterações:
//----------------------------  1.0 - EK - 20/04/2024 - Liberação da versão para o processo de inscrição 2o. Sem/2024
//----------------------------  2.0 - EK - 15/05/2024 - Automação do formulário
//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//

//----- Tratamento de Eventos
//----- Consultar lista de eventos em https://frappeframework.com/docs/v13/user/en/api/form
frappe.ui.form.on('LM Interview', {
    before_save: function (frm) {
        set_media_prova(frm);
        set_media_final(frm);
    },

    onload: function (frm) {
        set_media_prova(frm);
        set_media_final(frm);
    },

    refresh: function (frm) {
        // Opções do campo para Responsável Legal / Financeiro
        var options = [frm.doc.usuario, frm.doc.senai_pai, frm.doc.senai_mae, frm.doc.senai_resp];

        // Defina as opções do campo usando o método set_df_property()
        frm.set_df_property('senai_resp_legal_fin_nome', 'options', options);

        if (frm.doc.senai_idade >= 18) {
            frm.doc.senai_resp_legal_fin_nome = frm.doc.usuario;
            frm.doc.senai_cpf_cnpj_resp_legal_fin_doc = frm.doc.senai_cpf;
        }
    }
});

//------- CALCULA MÉDIA DAS PROVAS
var set_media_prova = function (frm) {
    var media = 0.0;
    media = (parseFloat(frm.doc.matematica) + parseFloat(frm.doc.portugues) + parseFloat(frm.doc.logica) + parseFloat(frm.doc.redacao)) / 4;

    frm.set_value('media_prova', media);

    frm.refresh();
};

//------- CALCULA MÉDIA FINAL
var set_media_final = function (frm) {
    var media = 0.0;
    if (frm.doc.avaliacao != 0)
        media = (parseFloat(frm.doc.avaliacao) + frm.doc.media_prova) / 2;

    frm.set_value('media_final', media);

    frm.refresh();
};

//------- TRATAMENTO DA AVALIAÇÃO
frappe.ui.form.on('LM Interview', 'avaliacao', function (frm) {
    if (frm.doc.avaliacao) {
        frm.doc.finalizado = 1;
        frm.set_value('status', "Entrevistado");
    }
    else {
        frm.doc.finalizado = 0;
        frm.set_value('status', "Aguardando Entrevista");
    }
    frm.refresh();
});

//------- TRATAMENTO do RESULTADO DA AVALIAÇÃO
frappe.ui.form.on('LM Interview', 'status', function (frm) {
    //msgprint('Status');
});

// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM Interview", "onload", function (frm) {
    frm.set_query("reencaminhar", function () {
        return {
            "filters": {
                "alt": 1
            }
        };
    });
});

//------- TRATAMENTO DO LINK REENCAMINHAR
frappe.ui.form.on('LM Interview', 'reencaminhar', function (frm) {
    //msgprint('Reencaminhar: ' + frm.doc.reencaminhar);
    if (frm.doc.reencaminhar == frm.doc.student_group) {
        frm.set_value('status', "Aguardando Entrevista");
        frappe.show_alert("*** ATENÇÃO! Reencaminhamento não pode ser igual à turma desta entrevista.", 10)
        frm.doc.reencaminhar = "";
    }
    else
        if (frm.doc.reencaminhar) {
            frm.set_value('status', "Reencaminhado");
            frm.doc.finalizado = 1;

            //msgprint('antes de CreateInterview');
            frappe.call({
                method: "CreateRedirect",
                args: { doc: frm.doc },
                async: false,
                callback: function (response) { }
            });
        }
        else
            frm.set_value('status', "Aguardando Entrevista");
    frm.refresh();
});

//------- TRATAMENTO do CANCELAR REENCAMINHAMENTO
frappe.ui.form.on('LM Interview', 'cancel_redirect', function (frm) {
    msgprint('Cancelar Redirecionamento');
    frappe.call({
        method: "DeleteRedirect",
        args: { doc: frm.doc },
        async: false,
        callback: function (response) { }
    });

    frm.refresh();
});

//-----------------------------------------------------------------------------------------------------------
//------- DEFICIÊNCIAS E NECESSIDADES EDUCACIONAIS
frappe.ui.form.on('LM Interview', 'senai_def_nao_possui', function (frm) {
    if (frm.doc.senai_def_nao_possui) {
        frm.doc.senai_def_auditiva = 0;
        frm.doc.senai_def_fisica = 0;
        frm.doc.senai_def_visual = 0;
        frm.doc.senai_def_mental = 0;
        frm.doc.senai_def_multipla = 0;
        frm.doc.senai_def_outras = 0;
        frm.doc.senai_nec_altas_habilidades = 0;
        frm.doc.senai_nec_condutas_tipicas = 0;
        frm.doc.senai_def_outras_qual = "";
    }
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_auditiva', function (frm) {
    if (frm.doc.senai_def_auditiva)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_fisica', function (frm) {
    if (frm.doc.senai_def_fisica)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_visual', function (frm) {
    if (frm.doc.senai_def_visual)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_mental', function (frm) {
    if (frm.doc.senai_def_mental)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_multipla', function (frm) {
    if (frm.doc.senai_def_multipla)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_outras', function (frm) {
    if (frm.doc.senai_def_outras)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_nec_altas_habilidades', function (frm) {
    if (frm.doc.senai_nec_altas_habilidades)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_nec_condutas_tipicas', function (frm) {
    if (frm.doc.senai_nec_condutas_tipicas)
        frm.doc.senai_def_nao_possui = 0;
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_def_outras_qual', function (frm) {
    if (frm.doc.senai_def_outras_qual) {
        frm.doc.senai_def_nao_possui = 0;
        frm.doc.senai_def_outras = 1;
    }
    frm.refresh();
});


//-----------------------------------------------------------------------------------------------------------
//------- ESCOLARIDADE
frappe.ui.form.on('LM Interview', 'senai_esc_ano_conclusao', function (frm) {
    if (frm.doc.senai_esc_ano_conclusao) {
        frm.doc.senai_esc_concluido = 1;
    }
    frm.refresh();
});

frappe.ui.form.on('LM Interview', 'senai_esc_cursando_serie', function (frm) {
    if (frm.doc.senai_esc_cursando_serie) {
        frm.doc.senai_esc_ano_conclusao = "";
        frm.doc.senai_esc_concluido = 0;
    }
    frm.refresh();
});
//-----------------------------------------------------------------------------------------------------------
//------- TRATAMENTO DO RESPONSÁVEL LEGAL / FINANCEIRO
frappe.ui.form.on('LM Interview', 'senai_resp_legal_fin_nome', function (frm) {
    if (frm.doc.senai_resp_legal_fin_nome == frm.doc.usuario)
        frm.doc.senai_cpf_cnpj_resp_legal_fin_doc = frm.doc.senai_cpf;

    if (frm.doc.senai_resp_legal_fin_nome == frm.doc.senai_pai)
        frm.doc.senai_cpf_cnpj_resp_legal_fin_doc = frm.doc.senai_cpf_pai;

    if (frm.doc.senai_resp_legal_fin_nome == frm.doc.senai_mae)
        frm.doc.senai_cpf_cnpj_resp_legal_fin_doc = frm.doc.senai_cpf_mae;

    if (frm.doc.senai_resp_legal_fin_nome == frm.doc.senai_resp)
        frm.doc.senai_cpf_cnpj_resp_legal_fin_doc = frm.doc.senai_cpf_resp;

    frm.refresh();
});
//-----------------------------------------------------------------------------------------------------------
//------- TRATAMENTO DO BOTÃO EFETUAR MATRÍCULA
frappe.ui.form.on('LM Interview', 'efetuar_matrícula', function (frm) {
    if (frm.doc.program_enrollment)
        msgprint('Matrícula já efetuada!');
    else {
        msgprint('O processo de matrícula será finalizado de forma automática.');
        //frm.set_value('status', "Matriculado");
        //frm.doc.finalizado = 1;
    }
    frm.refresh();
});
//------- TRATAMENTO DO BOTÃO CANCELAR MATRÍCULA
frappe.ui.form.on('LM Interview', 'cancelar_matrícula', function (frm) {
    msgprint('Client Script: Cancelar Matrícula');
    try {
        frappe.call({
            method: "CancelEnrollment",
            args: { doc: frm.doc },
            async: false,
            callback: function (response) { }
        });

        frm.doc.program_enrollment = "";
        frm.doc.id_crianca = "";
        frm.set_value('status', "Aguardando Entrevista");
        frm.doc.finalizado = 0;

        frm.refresh();

    } catch (error) {
        msgprint('*** (Interview Script) Erro: ' + error);
    }
});

