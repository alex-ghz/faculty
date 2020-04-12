import sympy
import sys
import time


def print_these(**kwargs):
    for key, value in kwargs.items():
        print(key, " - ", value)


def get_rand_prime():
    return sympy.randprime(pow(2, 512), pow(2, 523))


def generate_pq():
    p = q = get_rand_prime()

    while p == q:
        q = get_rand_prime()

    return p, q


def get_file_content(file_path):
    with open(file_path, "rb") as fd:
        content = fd.read()

    return content


def save_encrypted_content(encrypted_text):
    with open("encrypted.txt", "w") as fd:
        fd.write(str(encrypted_text))


def get_encrypted_file(file_path, n, e):
    text = get_file_content(file_path)
    text = int.from_bytes(text, byteorder=sys.byteorder)

    encrypted_text = pow(text, e, n)
    save_encrypted_content(encrypted_text)

    return encrypted_text


def decrypt(y, d, n):
    start = time.time()

    x = pow(y, d, n)

    end = time.time() - start

    return x, end


def crt_hensel(y, d, p, q, e):
    start = time.time()

    x = None
    mq = pow(y % q, d % (q - 1), q)
    m0 = pow(y % p, d % (p - 1), p)
    m1 = (((y - pow(m0, e, p * p)) // p) * sympy.mod_inverse(e * pow(m0, e - 1, p), p)) % p
    mp2 = m1 * p + m0
    x = mp2
    alpha = (((mq - x) % q) * sympy.mod_inverse(mp2, q)) % q
    x += alpha * mp2

    end = time.time() - start

    return x, end


def multipower_RSA(iterations=10):
    average_time = 0

    for iteration in range(iterations):
        # print("Iteration: ", iteration)
        p, q = generate_pq()

        n = p * p * q
        phi_n = p * (p - 1) * (q - 1)
        e = pow(2, 16) + 1

        d = sympy.mod_inverse(e, phi_n)
        y = get_encrypted_file("message.txt", n, e)

        # print_these(q=q, e=e, d=d, y=y, m=int.from_bytes(get_file_content("message.txt"), byteorder=sys.byteorder))

        x_crt_hensel, time_crt_hensel = crt_hensel(y, d, p, q, e)
        x_decrypt, time_decrypt = decrypt(y, d, n)

        print(x_crt_hensel)
        print(x_decrypt)

        average_time += time_decrypt / time_crt_hensel

    print(average_time / iterations)


multipower_RSA()
