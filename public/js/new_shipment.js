if (serverErrors.length > 0) {
    const isDark = (localStorage.getItem('theme') ?? 'light') === 'dark';

    Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: serverErrors.map(e => `<p>${e.msg}</p>`).join(''),
        confirmButtonText: 'Aceptar',
        confirmButtonColor: isDark ? '#3b82f6' : '#2563eb',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f1f5f9' : '#1e293b',
        iconColor: isDark ? '#f87171' : '#dc2626',
    });
}else{
        Swal.fire({
        icon: 'sucess',
        title: 'Envio creado con exito!',
        html: serverErrors.map(e => `<p>${e.msg}</p>`).join(''),
        confirmButtonText: 'Aceptar',
        confirmButtonColor: isDark ? '#3b82f6' : '#2563eb',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f1f5f9' : '#1e293b',
        iconColor: isDark ? '#71f871' : '#26dc2c',
    });
}