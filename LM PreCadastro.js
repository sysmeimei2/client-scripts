//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------- Nome: LM PreCadastro.js
//------------------- Doctype: LM PreCadastro
//----------------- Descricao: Formatação de página, tratamento da digitação do doctype e armazenamento dos resultados das provas realizadas
//------------------ Contexto: Cadastro inicial dos usuários do Lar Meimei
//---------------------- Data: 14/04/2024
//--------------------- Autor: Eduardo Kuniyoshi (EK)
//--- Histórico de alterações:
//----------------------------  1.0 - EK - 14/04/2024 - Liberação da versão para o processo de inscrição 2o. Sem/2024
//----------------------------  2.0 - EK - 17/04/2024 - Automação do fluxo do trabalho, com a revisão dos Status do documento.
//----------------------------  3.0 - EK - 16/05/2024 - Verifica a existência de um CPF na base Lar Meimei
//----------------------------  4.0 - EK - 27/05/2024 - Otimização de código
//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//

//----- Tratamento de Eventos
//----- Consultar lista de eventos em https://frappeframework.com/docs/v13/user/en/api/form
frappe.ui.form.on('LM PreCadastro',  {
    setup: function(frm) {
		//frm.set_value('first_name', frm.doc.full_name);
    },
    before_load: function(frm) {
        frm.fields_dict['section_1'].wrapper.css('background-color' , 'antiquewhite');
        frm.fields_dict['section_cpf'].wrapper.css('background-color' , 'antiquewhite');
        frm.fields_dict['section_3'].wrapper.css('background-color' , 'antiquewhite');
        frm.fields_dict['section_4'].wrapper.css('background-color' , 'antiquewhite');
        frm.fields_dict['section_61'].wrapper.css('background-color', 'beige');
        frm.fields_dict['section_62'].wrapper.css('background-color', 'beige');
        frm.fields_dict['section_71'].wrapper.css('background-color', 'lightblue');
        frm.fields_dict['section_8'].wrapper.css('background-color' , 'cadetblue');
        
        // Obter o elemento `a` da guia "Detalhes"
        //const detalhesTab = doc.querySelector('a[data-tab="composição_familiar_tab"]');
        //frm.set_value('first_name', frm.doc.full_name);
        //set_idade(frm);
    },

    validate: function(frm) {
        set_idade(frm);
        if (frm.doc.cpf && !frm.doc.cpf_ok && !frm.doc.cpf_provisorio) {
            set_cpf(frm);
        }

        //if (frm.doc.cep ) {
            //set_cep(frm);
        //}

        //if (frm.doc.email_provisorio)
        //    email_gen(frm);
    
        if (frm.doc.usuario)
            if (frm.doc.full_name != frm.doc.usuario) {
                show_alert('*** ATENÇÃO! NOME  COMPLETO diferente do nome cadastrado. É necessário verificar e reiniciar o cadastramento.');
                frm.doc.status = "Pré Cadastro";
                frm.doc.ifchecked = 0;
            }
    },

    refresh: function(frm) {
        var buttonEnt = frm.fields_dict.enc_entrev.wrapper;     // Seletor para o botão Encaminhar para Entrevistas
        buttonEnt.style.textAlign = 'center';                   // Centraliza o botão

        var buttonOrient = frm.fields_dict.enc_orient.wrapper;  // Seletor para o botão Encaminhar para Orientação
        buttonOrient.style.textAlign = 'center';                // Centraliza o botão        

        var buttonSF = frm.fields_dict.sf_enc_entrev.wrapper;   // Seletor para o botão Encaminhar para Entrevistas
        buttonSF.style.textAlign = 'center';                    // Centraliza o botão

        if (frm.doc.ifchecked) {
            if (frm.doc.zero_mat_por) {
                buttonEnt.style.backgroundColor = 'red';            // Alterar a cor de fundo do botão
                buttonSF.style.backgroundColor = 'red';             // Alterar a cor de fundo do botão

                if (frm.doc.alt_interview)
                    buttonOrient.style.backgroundColor = 'red';       // Alterar a cor de fundo do botão
                    //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                else
                    buttonOrient.style.backgroundColor = 'green';       // Alterar a cor de fundo do botão
                    //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                    //msgprint('*** ATENÇÃO! o usuário zerou em Matemática e Português. Encaminhar para Orientação.');
            }
            else {
                buttonOrient.style.backgroundColor = 'red';       // Alterar a cor de fundo do botão
                
                if (frm.doc.sit_op_curso) {
                    if (frm.doc.socio_familiar)
                        buttonSF.style.backgroundColor = 'green';           // Alterar a cor de fundo do botão
                        //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                    else
                        buttonSF.style.backgroundColor = 'red';             // Alterar a cor de fundo do botão

                    if (frm.doc.mundo_trabalho)
                        if (frm.doc.sit_correcao)
                            buttonEnt.style.backgroundColor = 'green';          // Alterar a cor de fundo do botão
                        else
                            //msgprint('*** ATENÇÃO! Provas ainda não foram corrigidas.');
                            buttonEnt.style.backgroundColor = 'red';            // Alterar a cor de fundo do botão
                }
                else {
                    //msgprint('*** ATENÇÃO! Opções do Usuário não foram confirmadas.');
                    
                    buttonSF.style.backgroundColor = 'red';             // Alterar a cor de fundo do botão
                    //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
    
                    buttonEnt.style.backgroundColor = 'red';            // Alterar a cor de fundo do botão
                    //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                }
            }
        }
        else {
            if (!frm.doc.cpf) {
                buttonSF.style.backgroundColor = 'red';             // Alterar a cor de fundo do botão
                //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                buttonEnt.style.backgroundColor = 'red';            // Alterar a cor de fundo do botão
                //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
                buttonOrient.style.backgroundColor = 'red';         // Alterar a cor de fundo do botão
                //buttonEnt.style.color = 'white';                  // Alterar a cor do texto do botão
            }
        }
    }
 });

//----------------------------------------------------------------------------------------------------- IDENTIFICAÇÃO
//----------------------------------------------------------------------------------------------------- IDENTIFICAÇÃO

//---------- Nome do Usuário para MAIÚSCULAS
frappe.ui.form.on('LM PreCadastro', 'full_name', function(frm) {
    // frm.set_intro('checking the indicator');
    frm.doc.full_name = frm.doc.full_name.toUpperCase();
    frm.refresh_field('full_name');
});

//----- Detecta alteração na data de nascimento
frappe.ui.form.on('LM PreCadastro', 'date_of_birth', function(frm) {
    // frm.set_intro('checking the indicator');
    set_idade(frm);
    
    if (frm.doc.full_name)
		if (frm.doc.idade < 17.08) { // faltando um mês para completar 18
			msgprint('ATENÇÃO! Usuário menor de idade. Indicar os pais e/ou responsáveis legais.');
			if (frm.doc.idade > 10)
				frm.set_value('customer_group', "CR-Criança ACIMA de 10 anos");
			else
				frm.set_value('customer_group', "CR-Criança abaixo de 10 anos");
		}
		else
			frm.set_value('customer_group', "CG-LM Assistido");
    
    //frm.set_value('student_group_sab', "");
    frm.refresh();
});

//----- Calcula a idade
var set_idade = function(frm) {
    var total_idade = 0;
    //total_idade = date_diff(get_today(),frm.doc.data_nascimento)
    //if (frm.doc.date_of_birth.length !== 0) {
        total_idade = moment(get_today()).diff(frm.doc.date_of_birth, 'days', true)/365;
        total_idade = Math.floor(total_idade);
    //}
    frm.set_value('idade', total_idade);
    
    frm.refresh();
};
//-------- Detecta alteração no Email
frappe.ui.form.on('LM PreCadastro', 'student_email_id', function(frm) {
    // frm.set_intro('check cpf');
    frm.set_value('email_provisorio', 0);
    frm.set_value('email_confirmado', 1);
});

//-------- Detecta alteração no flag Email Confirmado
frappe.ui.form.on('LM PreCadastro', 'email_confirmado', function(frm) {
    // frm.set_intro('check cpf');
    if (frm.doc.email_confirmado) {
        frm.set_value('email_provisorio', 0);
    }
    else frm.set_value('email_provisorio', 1);
    
});

//-------- Detecta alteração no flag Email Provisório
frappe.ui.form.on('LM PreCadastro', 'email_provisorio', function(frm) {
    // frm.set_intro('check cpf');

    if (frm.doc.email_provisorio) {
        email_gen(frm);
        frm.set_value('email_confirmado', 0);
    }
    else frm.set_value('email_confirmado', 1);
});

//-------- Gera Email provisório
var email_gen = function(frm) {
    var concat = "";
    if (frm.doc.cpf)
        concat =  frm.doc.cpf + "@larmeimei.org";
    else
        concat =  frm.doc.name + "@larmeimei.org";
    
    frm.set_value('student_email_id', concat);
    //frm.set_value('email_confirmado', 0);
        //frm.set_value('email_provisorio', 1);
        //frm.refresh();
}


frappe.ui.form.on('LM PreCadastro', 'cpf', function(frm) {
    // frm.set_intro('checking the indicator');
    set_cpf(frm);
    frm.refresh_field('cpf');
});

//-------- Detecta alteração no flag CPF Provisório
frappe.ui.form.on('LM PreCadastro', 'cpf_provisorio', function(frm) {
    //msgprint("CPF_PROVISORIO: " + frm.doc.cpf);
    //msgprint("frm.doc.usuario: " + frm.doc.full_name);
    // frm.set_intro('check cpf');
    if (frm.doc.cpf) {
        //frm.set_value('cpf', frm.doc.name);
    }
    else {
        var hashnumber = hashStringToNumber(frm.doc.full_name);
        //msgprint("hashnumber: " + hashnumber);
        var fake_cpf = padWithZeros(hashnumber);
        //frm.set_value('cpf', fake_cpf);
        frm.doc.cpf = fake_cpf;
        frm.doc.student_email_id = frm.doc.cpf + "@larmeimei.org";
        frm.doc.email_provisorio = 1;
        frm.refresh();
    }
});

function hashStringToNumber(s) {
    //msgprint("hash: " + s);
    var hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function padWithZeros(n) {
    //msgprint("padwithzeros: " + n);
    var s = "" + n;
    var padded = s.padStart(11, '0');
    return padded;
}



//-------- Valida o CPF
var set_cpf = function(frm) {
    var strCPF = (frm.doc.cpf).toString();
    //------------------ Teste do CPF

    var strCPF2 = strCPF.replace(/[^0-9]/g,'');
    strCPF = strCPF2;
    frm.set_value('cpf', strCPF);
    if (strCPF.length != 11 )
    {
        frm.set_value('cpf_ok', 0);
        frm.set_value('cpf_provisorio', 1);
        show_alert('CPF tamanho invalido :'+ strCPF.length , 5);
        return false;
    }

    var Soma;
    var Resto;
    var i;
    Soma = 0;
    i=1;
    for (i; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    i=1;
    for (i; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) {
        frm.set_value('cpf_ok', 0);
        frm.set_value('cpf_provisorio', 1);
        show_alert('CPF invalido!' , 5);
        return false;
    }
    frm.set_value('cpf_ok', 1);
    frm.set_value('cpf_provisorio', 0);
    show_alert('CPF ok ' , 5);
    frm.refresh();
    return true;
};

frappe.ui.form.on('LM PreCadastro', 'verificar_cadastro', function(frm) {
    //-----------------------------------Verifica se o CPF já está na base
    if (frm.doc.cpf) {
        frappe.call({ method: "isCPFinDB", 
            args: { doc: frm.doc },
            async: false,
            callback: function(response) {        }
        });
    }
    else
        show_alert('*** ATENÇÃO! Digite o CPF para pesquisar.' , 5);
});

//----------------------------------------------------------------------------------------------------- CORREÇÃO DE PROVAS
//----------------------------------------------------------------------------------------------------- CORREÇÃO DE PROVAS
//----- Detecta alteração na correção de Matemática
frappe.ui.form.on('LM PreCadastro', 'mat_01', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_02', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_03', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_04', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_05', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_06', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_07', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_08', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_09', function(frm) {
    set_mat(frm);
});
frappe.ui.form.on('LM PreCadastro', 'mat_10', function(frm) {
    set_mat(frm);
});
//----- Calcula Nota de Matemátia
var set_mat = function(frm) {
    var total_mat = 0.0;
        total_mat += parseFloat(frm.doc.mat_01);
        total_mat += parseFloat(frm.doc.mat_02);
        total_mat += parseFloat(frm.doc.mat_03);
        total_mat += parseFloat(frm.doc.mat_04);
        total_mat += parseFloat(frm.doc.mat_05);
        total_mat += parseFloat(frm.doc.mat_06);
        total_mat += parseFloat(frm.doc.mat_07);
        total_mat += parseFloat(frm.doc.mat_08);
        total_mat += parseFloat(frm.doc.mat_09);
        total_mat += parseFloat(frm.doc.mat_10);

    frm.set_value('matemática', total_mat);
    //frm.refresh();
};

//----- Detecta alteração na correção de Português
frappe.ui.form.on('LM PreCadastro', 'por_01', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_02', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_03', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_04', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_05', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_06', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_07', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_08', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_09', function(frm) {
    set_por(frm);
});
frappe.ui.form.on('LM PreCadastro', 'por_10', function(frm) {
    set_por(frm);
});
//----- Calcula Nota de Matemátia
var set_por = function(frm) {
    var total_por = 0.0;
        total_por += parseFloat(frm.doc.por_01);
        total_por += parseFloat(frm.doc.por_02);
        total_por += parseFloat(frm.doc.por_03);
        total_por += parseFloat(frm.doc.por_04);
        total_por += parseFloat(frm.doc.por_05);
        total_por += parseFloat(frm.doc.por_06);
        total_por += parseFloat(frm.doc.por_07);
        total_por += parseFloat(frm.doc.por_08);
        total_por += parseFloat(frm.doc.por_09);
        total_por += parseFloat(frm.doc.por_10);

    frm.set_value('português', total_por);
    //frm.refresh();
};

//----- Detecta alteração na correção de Lógica
frappe.ui.form.on('LM PreCadastro', 'log_01', function(frm) {
    set_log(frm);
});
frappe.ui.form.on('LM PreCadastro', 'log_02', function(frm) {
    set_log(frm);
});
frappe.ui.form.on('LM PreCadastro', 'log_03', function(frm) {
    set_log(frm);
});
frappe.ui.form.on('LM PreCadastro', 'log_04', function(frm) {
    set_log(frm);
});
frappe.ui.form.on('LM PreCadastro', 'log_05', function(frm) {
    set_log(frm);
});

//----- Calcula Nota de Lógica
var set_log = function(frm) {
    var total = 0.0;
        total += parseFloat(frm.doc.log_01);
        total += parseFloat(frm.doc.log_02);
        total += parseFloat(frm.doc.log_03);
        total += parseFloat(frm.doc.log_04);
        total += parseFloat(frm.doc.log_05);

    frm.set_value('lógica', total);
    //frm.refresh();
};

//----- Detecta alteração na correção de Redação
frappe.ui.form.on('LM PreCadastro', 'red_01', function(frm) {
    set_red(frm);
});
frappe.ui.form.on('LM PreCadastro', 'red_02', function(frm) {
    set_red(frm);
});
frappe.ui.form.on('LM PreCadastro', 'red_03', function(frm) {
    set_red(frm);
});
frappe.ui.form.on('LM PreCadastro', 'log_04', function(frm) {
    set_red(frm);
});
frappe.ui.form.on('LM PreCadastro', 'red_05', function(frm) {
    set_red(frm);
});
frappe.ui.form.on('LM PreCadastro', 'red_06', function(frm) {
    set_red(frm);
});

//----- Calcula Nota de Redação
var set_red = function(frm) {
    var total = 0.0;
        total += parseFloat(frm.doc.red_01);
        total += parseFloat(frm.doc.red_02);
        total += parseFloat(frm.doc.red_03);
        total += parseFloat(frm.doc.red_04);
        total += parseFloat(frm.doc.red_05);
        total += parseFloat(frm.doc.red_06);

    frm.set_value('redação', total);
    //frm.refresh();
};

//------- TRATAMENTO DA DIGITAÇÃO DA NOTA MATEMÁTICA
frappe.ui.form.on('LM PreCadastro', 'mat_dig', function(frm) {
    //if (frm.doc.mat_dig)
    frm.doc.matemática = frm.doc.mat_dig;
    set_zero_mat_por(frm);
    set_sit_correcao(frm);
});

//------- TRATAMENTO DA DIGITAÇÃO DA NOTA PORTUGUÊS
frappe.ui.form.on('LM PreCadastro', 'por_dig', function(frm) {
    //if (frm.doc.mat_dig)
    frm.doc.português = frm.doc.por_dig;
    set_zero_mat_por(frm);
    set_sit_correcao(frm);
});

//------- TRATAMENTO DA DIGITAÇÃO DA NOTA LÓGICA
frappe.ui.form.on('LM PreCadastro', 'log_dig', function(frm) {
    //if (frm.doc.mat_dig)
    frm.doc.lógica = frm.doc.log_dig;
    set_sit_correcao(frm);
});

//------- TRATAMENTO DA DIGITAÇÃO DA NOTA REDAÇÃO
frappe.ui.form.on('LM PreCadastro', 'red_dig', function(frm) {
    //if (frm.doc.mat_dig)
    frm.doc.redação = frm.doc.red_dig;
    set_sit_correcao(frm);
});

//----- Atualiza SIT_CORRECAO
var set_sit_correcao = function(frm) {
    if(frm.doc.mat_dig && frm.doc.por_dig && frm.doc.log_dig && frm.doc.red_dig) {
        frm.doc.sit_correcao = 1;
        frm.doc.status = "Provas Corrigidas"
    }
    else {
        frm.doc.sit_correcao = 0;
        if (frm.doc.sit_op_curso)
            frm.doc.status = "Cadastro Conferido";
        else
            frm.doc.status = "Pré Cadastro";
    }
    frm.refresh();
};

//----- Atualiza ZERO_MAT_POR
var set_zero_mat_por = function(frm) {
    if(frm.doc.mat_dig && frm.doc.por_dig)
        if(frm.doc.mat_dig == 0 && frm.doc.por_dig == 0) {
            frm.doc.zero_mat_por = 1;
    		/*
    		if (frm.doc.student_group_sab)
    				if(frm.doc.segmento_sab == "MT - Mundo do Trabalho")
    						frm.doc.idade_aluno_sab_ok = 0;
    		if (frm.doc.student_group_sab_2)
    				if(frm.doc.segmento_sab_2 == "MT - Mundo do Trabalho")
    						frm.doc.idade_aluno_sab_2_ok = 0;
    		if (frm.doc.student_group_sab_t)
    				if(frm.doc.segmento_sab_t == "MT - Mundo do Trabalho")
    						frm.doc.idade_aluno_sab_t_ok = 0;
    		if (frm.doc.student_group_dom)
    				if(frm.doc.segmento_dom == "MT - Mundo do Trabalho")
    						frm.doc.idade_aluno_dom_ok = 0;
    		if (frm.doc.student_group_dom_2)
    				if(frm.doc.segmento_dom_2 == "MT - Mundo do Trabalho")
    						frm.doc.idade_aluno_dom_2_ok = 0;
    		*/
    		frm.doc.student_group_alt = "";
    		frm.doc.idade_aluno_alt_ok = 1;
        }
        else {
            frm.doc.zero_mat_por = 0;
    		frm.doc.student_group_alt = "105-SG-Assistência Social";
        }
    else {
        frm.doc.zero_mat_por = 0;
        frm.doc.student_group_alt = "";
    }

    frm.refresh();
};

//------- TRATAMENTO DO BOTÃO ENCAMINHAR PARA ENTREVISTAS
frappe.ui.form.on('LM PreCadastro', 'enc_entrev', function(frm) {
    try {
        //frm.set_value('processamento', "MT - Mundo do Trabalho");
        frm.doc.processamento = "MT - Mundo do Trabalho";
        /*
        if (!frm.doc.nome_mãe)
            frm.doc.nome_mãe = "*** NÃO INFORMADO"
        if (!frm.doc.nome_pai)
            frm.doc.nome_pai = "*** NÃO INFORMADO"
        if (!frm.doc.nome_resp)
            frm.doc.nome_resp = "*** NÃO INFORMADO"
        */
        if (frm.doc.sit_op_curso)
            if (frm.doc.mundo_trabalho) {
    			if (frm.doc.sit_correcao && !frm.doc.zero_mat_por) {
    				//msgprint('Encaminhar para entrevista');
    				create_customer(frm);
    				set_student(frm);				
    				
    				frappe.call({ method: "CreateInterview",
    					args: {doc: frm.doc },
    					async: false,
    					callback: function(response) {
    					}
    				});            
    				frm.doc.status = "M.Trab. Entrevista";
    				
    				set_segmento(frm);
    				//frm.refresh();
    				
    			}
    			else
    			    msgprint('*** ATENÇÃO! Provas não corrigidas e/ou o usuário zerou em Matémática e Português.');	
            }
            else
                msgprint('*** ATENÇÃO! O usuário não optou por um curso do Programa Mundo do Trabalho e/ou não é elegível.');
        else
            msgprint('*** ATENÇÃO! Os dados cadastrais e/ou as opções ainda não foram conferidas.');

    } catch (error) {
        msgprint('*** (Client Script) Erro de processamento: ' + error);
    }		        
});

//------- TRATAMENTO DO BOTÃO ENCAMINHAR PARA ORIENTAÇÃO
frappe.ui.form.on('LM PreCadastro', 'enc_orient', function(frm) {
    try {
        /*
        if (!frm.doc.nome_mãe)
            frm.doc.nome_mãe = "*** NÃO INFORMADO"
        if (!frm.doc.nome_pai)
            frm.doc.nome_pai = "*** NÃO INFORMADO"
        if (!frm.doc.nome_resp)
            frm.doc.nome_resp = "*** NÃO INFORMADO"
        */
        
        if (frm.doc.alt_interview)
            msgprint('O usuário já foi encaminhado para a Orientação.');
        else
            if (frm.doc.ifchecked)
    			if (frm.doc.zero_mat_por) {
    				create_customer(frm);
    				set_student(frm);

    				frm.doc.processamento = "AS - Assistência Social";
    				processa_alt(frm);
    				
    				frappe.call({ method: "CreateInterview",
    					args: { doc: frm.doc },
    					async: false,
    					callback: function(response) {
    					}
    				});            
    				frm.doc.status = "A.Soc. Entrevista";
    				set_segmento(frm)
    				//frm.refresh();
    			}
    			else
    				msgprint('*** ATENÇÃO! O usuário não zerou em Matemática e em Português.');
        	else
        		msgprint('*** ATENÇÃO! Os dados cadastrais ainda não foram conferidos.');

    } catch (error) {
        msgprint('*** (Client Script): ' + error);
    }		
});


//----------------------------------------------------------------------------------------------------- OPÇÕES DE CURSO
//----------------------------------------------------------------------------------------------------- OPÇÕES DE CURSO
// ----------------------------------------------------------------------
// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_sab", function() {
        return {
            "filters": {
                "sab": 1
            }
        };
    });
});

// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_sab_2", function() {
        return {
            "filters": {
                "sab2": 1
            }
        };
    });
});

// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_sab_t", function() {
        return {
            "filters": {
                "sab_t": 1
            }
        };
    });
});

// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_dom", function() {
        return {
            "filters": {
                "dom": 1
            }
        };
    });
});

// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_dom_2", function() {
        return {
            "filters": {
                "dom2": 1
            }
        };
    });
});


// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt
frappe.ui.form.on("LM PreCadastro", "onload", function(frm) {
    frm.set_query("student_group_alt", function() {
        return {
            "filters": {
                "alt": 1
            }
        };
    });
});

// ----------------------------------------------------------------------
//-------- TRATAMENTO DAS OPÇÕES DE CURSOS
// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'atualizar_seg', function(frm) {
	set_student(frm);

});

var set_student = function(frm) {
	show_alert('Atualiza Usuário com a chave do Aluno.' , 5);
    frappe.call({ method: "UpdateCustomerWithStudent",
    		args: { doc: frm.doc },
    		async: false,
    		callback: function(response) {
    		}
    	});

};

// ----------------------------------------------------------------------

frappe.ui.form.on('LM PreCadastro', 'student_group_sab', function(frm) {
	
    if (frm.doc.student_group_sab)
        if (valida_idade(frm, frm.doc.student_group_sab, frm.doc.idade_minima_sab,frm.doc.idade_maxima_sab)) 
            //frm.set_value('idade_aluno_sab_ok', 1);
            frm.doc.idade_aluno_sab_ok = 1;
        else
            if (frm.doc.sab_interview) 
                apaga_fila(frm, "del_sab");
            else
                apaga_op_sab(frm);
    
    if (frm.doc.student_group_sab)
        if (frm.doc.student_group_sab.substring(0, 3) == frm.doc.student_group_dom.substring(0, 3) || 
            frm.doc.student_group_sab.substring(0, 3) == frm.doc.student_group_dom_2.substring(0, 3)) {
            msgprint('*** ATENÇÃO! Não é permitida a inscrição no curso de Informática no sábado e no domingo.' );
            apaga_op_sab(frm);
        }

	set_segmento(frm);
	frm.refresh();

});

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_sab', function(frm) {
    if (frm.doc.sab_interview) { 
	    apaga_fila(frm, "del_sab");
    }
	else {
	    apaga_op_sab(frm);
	}

    set_segmento(frm);    
    frm.refresh();     
    
});

var apaga_op_sab = function(frm) {
    frm.set_value('idade_aluno_sab_ok', 0);
    frm.set_value('student_group_sab', "");
    //frm.doc.student_group_sab   = "";
    frm.doc.idade_minima_sab    = "";
    frm.doc.idade_maxima_sab    = "";
    frm.doc.escolaridade_sab    = "";
    frm.doc.program_sab         = "";
    frm.doc.academic_year_sab   = "";
    frm.doc.academic_term_sab   = "";
    frm.doc.segmento_sab        = ""; 
    frm.doc.sab_interview       = "";
    frm.doc.status              = "Pré Cadastro";
    frm.doc.sit_op_curso        = 0;
};

// ----------------------------------------------------------------------
var apaga_fila = function(frm, fila) {

	frm.doc.processamento = fila;
	msgprint('frm.doc.processamento: ' + frm.doc.processamento);
	
	//var doc = frm.doc;
	frappe.call({ method: "DeleteInterview",
		args: { doc: frm.doc },
		async: false,
		callback: function(response) {
		}
	});
};

// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'student_group_sab_2', function(frm) {
    if (frm.doc.student_group_sab_2)
        if (frm.doc.student_group_sab) {
            if (valida_idade(frm, frm.doc.student_group_sab_2, frm.doc.idade_minima_sab_2,frm.doc.idade_maxima_sab_2)) 
                frm.set_value('idade_aluno_sab_2_ok', 1);
            else
                if (frm.doc.sab_interview) 
                    apaga_fila(frm, "del_sab_2");
                else
                    apaga_op_sab_2(frm);
            if (frm.doc.student_group_sab_2) {
                if (frm.doc.student_group_sab_2.substring(0, 3) == frm.doc.student_group_dom.substring(0, 3) || 
                    frm.doc.student_group_sab_2.substring(0, 3) == frm.doc.student_group_dom_2.substring(0, 3)) {
                    msgprint('*** ATENÇÃO! Não é permitida a inscrição no curso de Informática no sábado e no domingo para o mesmo usuário.' );
                    apaga_op_sab_2(frm);
                }
                else
                    if (frm.doc.student_group_sab == frm.doc.student_group_sab_2 || frm.doc.student_group_sab_t == frm.doc.student_group_sab_2) {
                        msgprint('*** ATENÇÃO! Segunda opção NÃO PODE SER IGUAL à sua opção principal!');
                        apaga_op_sab_2(frm);
                    }
            }
        }
        else {
            msgprint('*** ATENÇÃO! Preencha primeiro a OPÇÃO PRINCIPAL!');
            //apaga_fila(frm, "del_sab_2");
    		apaga_op_sab_2(frm);
        }
        
	set_segmento(frm);
	frm.refresh();
});

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_sab_2', function(frm) {
    if (frm.doc.sab_2_interview) 
	    apaga_fila(frm, "del_sab_2");
	else
        apaga_op_sab_2(frm);
    
    set_segmento(frm);
    frm.refresh();
});

var apaga_op_sab_2 = function(frm) {
    frm.set_value('idade_aluno_sab_2_ok', 0);
    frm.set_value('student_group_sab_2', "");
    //frm.doc.student_group_sab_2   = "";
    frm.doc.idade_minima_sab_2    = "";
    frm.doc.idade_maxima_sab_2    = "";
    frm.doc.escolaridade_sab_2    = "";
    frm.doc.program_sab_2         = "";
    frm.doc.academic_year_sab_2   = "";
    frm.doc.academic_term_sab_2   = "";
    frm.doc.segmento_sab_2        = ""; 
    frm.doc.sab_2_interview       = "";
    frm.doc.status              = "Pré Cadastro";
    frm.doc.sit_op_curso        = 0;
};

// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'student_group_sab_t', function(frm) {
    if (frm.doc.student_group_sab_t)
    	if (valida_idade(frm, frm.doc.student_group_sab_t, frm.doc.idade_minima_sab_t,frm.doc.idade_maxima_sab_t))
    		frm.set_value('idade_aluno_sab_t_ok', 1);
    	else
    	    if (frm.doc.sab_t_interview) 
                apaga_fila(frm, "del_sab_t");
            else
                apaga_op_sab_t(frm);
                
	set_segmento(frm);
	frm.refresh();
});

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_sab_t', function(frm) {
    if (frm.doc.sab_t_interview) 
	    apaga_fila(frm, "del_sab_t");
	else
	    apaga_op_sab_t(frm);
    
    set_segmento(frm);
    frm.refresh();
    
});

var apaga_op_sab_t = function(frm) {
    frm.set_value('idade_aluno_sab_t_ok', 0);
    frm.set_value('student_group_sab_t', "");
    //frm.doc.student_group_sab_t   = "";
    frm.doc.idade_minima_sab_t    = "";
    frm.doc.idade_maxima_sab_t    = "";
    frm.doc.escolaridade_sab_t    = "";
    frm.doc.program_sab_t         = "";
    frm.doc.academic_year_sab_t   = "";
    frm.doc.academic_term_sab_t   = "";
    frm.doc.segmento_sab_t        = ""; 
    frm.doc.sab_t_interview       = "";
    frm.doc.status              = "Pré Cadastro";
    frm.doc.sit_op_curso        = 0;
};

// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'student_group_dom', function(frm) {
    if (frm.doc.student_group_dom)
        //if (valida_idade(frm, frm.doc.student_group_dom, frm.doc.idade_minima_dom,frm.doc.idade_maxima_dom))
        //    frm.set_value('idade_aluno_dom_ok', 1);
        //else
        //    if (frm.doc.dom_interview) 
        //        apaga_fila(frm, "del_dom");
        //    else
        //        apaga_op_dom(frm);
    
    if (frm.doc.student_group_dom)
        if (frm.doc.student_group_sab.substring(0, 3) == frm.doc.student_group_dom.substring(0, 3) || 
            frm.doc.student_group_sab_2.substring(0, 3) == frm.doc.student_group_dom.substring(0, 3)) {
            msgprint('*** ATENÇÃO! Não é permitida a inscrição no curso de Informática no sábado e no domingo para o mesmo usuário.' );
            apaga_op_dom(frm);
        }

	if (frm.doc.program_dom == "115-PN Apoio à Gestante") {
        frm.set_value('customer_group', "CG-Gestante");
    }

	set_segmento(frm);
	frm.refresh();
});

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_dom', function(frm) {
    if (frm.doc.dom_interview) 
	    apaga_fila(frm, "del_dom");
	else 
	    apaga_op_dom(frm);
	    
    set_segmento(frm);
    frm.refresh();
});

var apaga_op_dom = function(frm) {
        frm.set_value('idade_aluno_dom_ok', 0);
        frm.set_value('student_group_dom', "");
        //frm.doc.student_group_dom   = "";
        frm.doc.idade_minima_dom    = "";
        frm.doc.idade_maxima_dom    = "";
        frm.doc.escolaridade_dom    = "";
        frm.doc.program_dom         = "";
        frm.doc.academic_year_dom   = "";
        frm.doc.academic_term_dom   = "";       
        frm.doc.segmento_dom        = "";
        frm.doc.dom_interview       = "";
        frm.doc.status              = "Pré Cadastro";
        frm.doc.sit_op_curso        = 0;    
};


// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'student_group_dom_2', function(frm) {
    if (frm.doc.student_group_dom_2)
        if (frm.doc.student_group_dom) {
            if (valida_idade(frm, frm.doc.student_group_dom_2, frm.doc.idade_minima_dom_2,frm.doc.idade_maxima_dom_2)) 
                frm.set_value('idade_aluno_dom_2_ok', 1);
            else
                if (frm.doc.dom_2_interview) 
                    apaga_fila(frm, "del_dom_2");
                else
                    apaga_op_dom_2(frm);        
            if (frm.doc.student_group_dom_2) {
                if (frm.doc.student_group_dom_2.substring(0, 3) == frm.doc.student_group_sab.substring(0, 3) || 
                    frm.doc.student_group_dom_2.substring(0, 3) == frm.doc.student_group_sab_2.substring(0, 3)) {
                    msgprint('*** ATENÇÃO! Não é permitida a inscrição no curso de Informática no sábado e no domingo para o mesmo usuário.' );
                    apaga_op_dom_2(frm);
                }
                else
                    if (frm.doc.student_group_dom_2 == frm.doc.student_group_dom) {
                        msgprint('*** ATENÇÃO! Segunda opção NÃO PODE SER IGUAL à sua opção principal!');
                        apaga_op_dom_2(frm);
                    }
            }
        }
    	else {
            msgprint('*** ATENÇÃO! Preencha primeiro a OPÇÃO PRINCIPAL!');
            //apaga_fila(frm, "del_sab_2");
    		apaga_op_dom_2(frm);
        }		
	
	set_segmento(frm);
	frm.refresh();    
});

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_dom_2', function(frm) {
    if (frm.doc.dom_2_interview) 
	    apaga_fila(frm, "del_dom_2");
	else
	    apaga_op_dom_2(frm);

    set_segmento(frm);
    frm.refresh();
});

var apaga_op_dom_2 = function(frm) {
    //msgprint('apaga_opcao_dom_2');
    frm.set_value('idade_aluno_dom_2_ok', 0);
    frm.set_value('student_group_dom_2', "");
    //frm.doc.student_group_dom_2   = "";
    frm.doc.idade_minima_dom_2    = "";
    frm.doc.idade_maxima_dom_2    = "";
    frm.doc.escolaridade_dom_2    = "";
    frm.doc.program_dom_2         = "";
    frm.doc.academic_year_dom_2   = "";
    frm.doc.academic_term_dom_2   = "";       
    frm.doc.segmento_dom_2        = "";
    frm.doc.dom_2_interview       = "";
    frm.doc.status              = "Pré Cadastro";
    frm.doc.sit_op_curso        = 0;        
}

// ----------------------------------------------------------------------
frappe.ui.form.on('LM PreCadastro', 'student_group_alt', function(frm) {
	processa_alt(frm);
});

var processa_alt = function(frm) {
    frm.doc.program_alt         = "105-PN Assistência Social";
    frm.doc.student_group_alt   = "105-SG-Assistência Social";
    frm.doc.segmento_alt        = "segmento_alt";
    //frm.set_value('student_group_alt', "105-SG-Assistência Social");
    
	if (valida_idade(frm, frm.doc.student_group_alt, frm.doc.idade_minima_alt,frm.doc.idade_maxima_alt))
		frm.set_value('idade_aluno_alt_ok', 1);
	else
	    if (frm.doc.alt_interview) 
            apaga_fila(frm, "del_alt");
        else
            apaga_op_alt(frm);

	set_segmento(frm);
	frm.refresh();
};

frappe.ui.form.on('LM PreCadastro', 'apaga_opcao_alt', function(frm) {
    if (frm.doc.alt_interview) 
	    apaga_fila(frm, "del_alt");
	else
	    apaga_op_alt(frm);

    set_segmento(frm);
    frm.refresh();
});

var apaga_op_alt = function(frm) {
    frm.set_value('idade_aluno_alt_ok', 0);
    frm.set_value('student_group_alt', "");
    //frm.doc.student_group_alt	= "";
    frm.doc.idade_minima_alt	= "";
    frm.doc.idade_maxima_alt	= "";
    frm.doc.escolaridade_alt	= "";
    frm.doc.program_alt			= "";
    frm.doc.academic_year_alt   = "";
    frm.doc.academic_term_alt 	= "";
    frm.doc.segmento_alt        = "";
    frm.doc.alt_interview       = "";
    frm.doc.status              = "Pré Cadastro";
    frm.doc.sit_op_curso        = 0;    
};

// ----------------------------------------------------------------------
var set_segmento = function(frm) {
    //msgprint('set segmento');
    //msgprint('segmento sabado: ' + frm.doc.segmento_sab);
    //msgprint('segmento domingo: ' + frm.doc.segmento_dom);

    if (frm.doc.student_group_dom   || 
        frm.doc.student_group_dom_2 ||
        frm.doc.student_group_sab   ||
        frm.doc.student_group_sab_2 ||
        frm.doc.student_group_sab_t) {
        //frm.doc.student_group_alt) {
        }
    else {
            // frm.set_value('mundo_trabalho', 0);
            // frm.set_value('socio_familiar', 0);
            frm.doc.mundo_trabalho = 0;
            frm.doc.socio_familiar = 0;
    }
    

    if( (frm.doc.segmento_dom    == "MT - Mundo do Trabalho" && frm.doc.idade_aluno_dom_ok)     || 
        (frm.doc.segmento_dom_2  == "MT - Mundo do Trabalho" && frm.doc.idade_aluno_dom_2_ok)   ||
        (frm.doc.segmento_sab    == "MT - Mundo do Trabalho" && frm.doc.idade_aluno_sab_ok)     ||
        (frm.doc.segmento_sab_2  == "MT - Mundo do Trabalho" && frm.doc.idade_aluno_sab_2_ok)   ||
        (frm.doc.segmento_sab_t  == "MT - Mundo do Trabalho" && frm.doc.idade_aluno_sab_t_ok)) {
        //(frm.doc.segmento_alt    == "AS - Assistência Social" && frm.doc.idade_aluno_alt_ok)) {
            frm.doc.mundo_trabalho = 1;
            //frm.set_value('mundo_trabalho', 1);
    }
    else
            //frm.set_value('mundo_trabalho', 0);
            frm.doc.mundo_trabalho = 0;

    if( (frm.doc.segmento_dom    == "SF - Sócio Familiar" && frm.doc.idade_aluno_dom_ok)    || 
        (frm.doc.segmento_dom_2  == "SF - Sócio Familiar" && frm.doc.idade_aluno_dom_2_ok)  ||
        (frm.doc.segmento_sab    == "SF - Sócio Familiar" && frm.doc.idade_aluno_sab_ok)    ||
        (frm.doc.segmento_sab_2  == "SF - Sócio Familiar" && frm.doc.idade_aluno_sab_2_ok)  ||
        (frm.doc.segmento_sab_t  == "SF - Sócio Familiar" && frm.doc.idade_aluno_sab_t_ok)) {
        //(frm.doc.segmento_alt    == "AS - Assistência Social" && frm.doc.idade_aluno_alt_ok)) {
            //frm.set_value('socio_familiar', 1);
            frm.doc.socio_familiar = 1;
    }
    else 
            //frm.set_value('socio_familiar', 0);
            frm.doc.socio_familiar = 0;
    
	//frm.doc.sit_op_curso = 0;
	//frm.doc.status = "Pré Cadastro";
    
	//frm.refresh_field("frm.doc.mundo_trabalho");
	//frm.refresh_field("frm.doc.socio_familiar");
};

//----- Valida a idade do aluno
var valida_idade = function(frm, istudent_group, imin,imax) {
	if (istudent_group) {
		if (frm.doc.idade < imin) { 
            msgprint('Validação da Idade do usuário(a): '+ frm.doc.idade);
	        msgprint('Idade mínima: '+ imin + '   | Idade máxima: ' + imax);
			msgprint('*** ATENÇÃO! Idade do usuário(a) menor que a idade mínima para o curso.'); 
			//msgprint('Idade mínima permitida: '+ imin);
			return 0;
		}
		else
			if(imax == 0) {
				//msgprint('Idade do usuário(a) OK. Pode prosseguir com o curso pretendido.');
				return 1;
			}
			else
				if (frm.doc.idade > imax) { 
                    msgprint('Validação da Idade do usuário(a): '+ frm.doc.idade);
        	        msgprint('Idade mínima: '+ imin + '   | Idade máxima: ' + imax);				    
					msgprint('*** ATENÇÃO! Idade do usuário(a) MAIOR que a idade MÁXIMA para o curso.'); 
			//		msgprint('Idade MÁXIMA permitida: '+ imax);
					return 0;
				}
				else {
					//msgprint('Idade do usuário(a) OK. Pode prosseguir com o curso pretendido.');
					return 1;
				}
	}
	else
		return 0;
};

//------- TRATAMENTO DO BOTÃO ENCAMINHAR PARA SF ENTREVISTA
frappe.ui.form.on('LM PreCadastro', 'sf_enc_entrev', function(frm) {
    try {   
        //frm.set_value('processamento', "SF - Sócio Familiar");
    	frm.doc.processamento = "SF - Sócio Familiar";
        /*
        if (!frm.doc.nome_mãe)
            frm.doc.nome_mãe = "*** NÃO INFORMADO"
        if (!frm.doc.nome_pai)
            frm.doc.nome_pai = "*** NÃO INFORMADO"
        if (!frm.doc.nome_resp)
            frm.doc.nome_resp = "*** NÃO INFORMADO"
        */
        //if(frm.doc.docstatus == 1)
            if (frm.doc.sit_op_curso) {
                if (frm.doc.socio_familiar) {

        			create_customer(frm);
        			set_student(frm);

                    frappe.call({ method: "CreateInterview",
                        args: { doc: frm.doc },
                        async: false,
                        callback: function(response) {       }
                    });
                    frm.doc.status = "S.Fam. Entrevista";
                    
                    set_segmento(frm);
                    //frm.refresh();           
        
                  }
                else {
                    msgprint('*** ATENÇÃO! O usuário não optou por um curso do Programa Sócio-Familiar e/ou não é elegível.');
                }
            }
            else
                msgprint('*** ATENÇÃO! Os dados cadastrais e/ou as opções ainda não foram conferidas.');
        //else
        //    msgprint('*** ATENÇÃO! Antes de continuar clique em SALVAR.');
    } catch (error) {
        msgprint('*** (Client Script) Erro de processamento: ' + error);
    }
});

//------- TRATAMENTO DO CHECKBOX SIT_OP_CURSO
frappe.ui.form.on('LM PreCadastro', 'sit_op_curso', function(frm) {
	//msgprint('CHECKBOX SIT_OP_CURSO ' + frm.doc.mundo_trabalho + ' | ' + frm.doc.socio_familiar);
    set_segmento(frm);
	//frm.refresh();	
    //if (frm.doc.mundo_trabalho || frm.doc.socio_familiar) {	
    if (frm.doc.student_group_sab || frm.doc.student_group_sab_2 || frm.doc.student_group_sab_t ||
        frm.doc.student_group_dom || frm.doc.student_group_dom_2) {
    	if (frm.doc.sit_op_curso) 
            if (frm.doc.sit_op_curso)
                frm.doc.status = "Cadastro Conferido"
            else
                frm.doc.status = "Pré Cadastro"
    }
    else {
            msgprint('*** ATENÇÃO! Nenhuma opção de curso foi realizada.');
            frm.doc.sit_op_curso = 0;
    }
        
    frm.refresh();
});


// ----------------------------------------------------------------------
var create_customer = function(frm) {
	//msgprint('create_customer');
	
	if (frm.doc.ifexist) 
	    show_alert('Usuário já existente no Cadastro Lar Meimei.' , 5);	    
    else {
	    frm.doc.processamento = 'LM PreCadastro';
	    //-----------------------------------Insert Customer
    	frappe.call({ method: "InsertCustomer",
    		args: { doc: frm.doc },
    		async: false,
    		callback: function(response) {    		}
	    });
	    
        show_alert('Usuário INSERIDO no Cadastro Lar Meimei.' , 5);
	}
	
};
// JavaScript source code
