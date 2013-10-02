(function( $ ){
    $.fn.ajaxMailSend = function() {

        var form = this;
        var button = this.find(".send_data");
        var to_mail = 'gafurovamir@gmail.com';
        var message_block = form.find(".message");
        var name  = form.find(".name").val();
        var email = form.find(".email").val();
        var phone = form.find(".phone").val();
        var all_required = form.find(".required");
        var empty_fields = 0;

        button.on("click", function(){

            button.val("Отправка...");

            all_required.each(function() {
                if(!$.trim($(this).val())) {
                    empty_fields++;
                }
            });

            all_required.each(function() {
                $(this).blur(function() {
                    if(!$.trim($(this).val())) {
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                });
            });

            if (!empty_fields>0) {
                $.ajax({
                    type: 'POST',
                    url: 'php/mail_send.php',
                    data: {
                        "to_mail": to_mail,
                        "name": name,
                        "phone": phone,
                        "email": email
                    },
                    success: function(data) {
                        if(data == "true") {
                            message_block.removeClass('error').addClass('fine').html('Отправлено!').slideDown(100).delay(3000).slideUp(200);
                            button.val("Отправлено!");
                        } else {
                            message_block.removeClass('fine').addClass('error').html('Ошибка!').slideDown(100).delay(3000).slideUp(200);
                            button.val("Ошибка!");
                        }
                    }
                });
            } else {
                message_block.removeClass('fine').addClass('error').html('Вы не заполнили обязательные поля').slideDown(100).delay(3000).slideUp(200);
                button.val("Ошибка!");
            };

        });

    };
})( jQuery );